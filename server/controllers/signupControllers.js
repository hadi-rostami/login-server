const queryPromise = require("../utils/QueryPromise");
const sendCode = require("../utils/SendEmail");
const { checkCode, DeleteCode } = require("../utils/CheckCode");
const { hashPassword } = require("../utils/HashOrVerifyPass");

async function signupRouteController(req, res) {
  const { email, password, code } = req.body;
  if (!email) {
    return res.status(400).send({
      success: false,
      message: "Email is required.",
    });
  }

  if (!password && !code) {
    return res.status(400).send({
      success: false,
      message: "Either password or code is required.",
    });
  }

  if (password && code) {
    return res.status(400).send({
      success: false,
      message: "Only one of password or code is required, not both.",
    });
  }

  try {
    const [user] = await queryPromise("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user && user.is_login) {
      return res.status(400).send({
        success: false,
        message: "Email is already registered.",
      });
    }

    if (user && password) {
      const [code, mesage] = await sendCodeHandler(email);
      return res.status(code).send(mesage);
    }

    if (!user && password) {
      const hashPasswordResult = await hashPassword(password);

      const response = await queryPromise(
        "INSERT INTO users (email, password, is_login) VALUES (?, ?, ?)",
        [email, hashPasswordResult, false]
      );

      if (response.affectedRows > 0) {
        const [code, mesage] = await sendCodeHandler(email);
        return res.status(code).send(mesage);
      }

      return res.status(400).send({
        success: false,
        message: "Error in SQL query!",
      });
    }

    if (user && code) {
      const codeValid = await checkCode(code, "SignUp");

      if (!codeValid) {
        return res.status(400).send({
          success: false,
          message: "Code is invalid or expired.",
        });
      }

      const updateResponse = await queryPromise(
        "UPDATE users SET is_login = 1 WHERE email = ?",
        [email]
      );

      if (updateResponse.changedRows > 0) {
        await DeleteCode(code, "SignUp");
        return res.status(200).send({
          success: true,
          message: "Registration successful. Please login.",
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "Failed to update user status.",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred during the signup process.",
    });
  }
}

const sendCodeHandler = async (email) => {
  const emailSent = await sendCode(email, "SignUp");

  if (emailSent) {
    return [
      200,
      {
        success: true,
        message: "Registration successful. Confirmation code sent to email.",
      },
    ];
  } else {
    return [
      500,
      {
        success: false,
        message: "Failed to send confirmation code after multiple attempts.",
      },
    ];
  }
};

module.exports = signupRouteController;
