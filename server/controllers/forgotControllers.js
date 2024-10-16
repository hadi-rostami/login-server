const sendCode = require("../utils/SendEmail");
const queryPromise = require("../utils/QueryPromise");
const { checkCode, DeleteCode } = require("../utils/CheckCode");
const { hashPassword } = require("../utils/HashOrVerifyPass");

async function forgotRouteController(req, res) {
  const { email, password, code } = req.body;

  if (!email) {
    return res.status(400).send({
      success: false,
      message: "Email is required.",
    });
  }

  try {
    const [user] = await queryPromise(
      "SELECT * FROM users WHERE email = ? AND is_login = 1",
      [email]
    );

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found or incorrect email.",
      });
    }

    if (email && !password && !code) {
      const emailSent = await sendCode(email, "ForGot");

      if (emailSent) {
        return res.status(200).send({
          success: true,
          message: "Confirmation code sent to email.",
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "Failed to send confirmation code.",
        });
      }
    }

    if (email && password && code) {
      const isCodeValid = await checkCode(code, "ForGot");

      if (!isCodeValid) {
        return res.status(400).send({
          success: false,
          message: "Invalid or expired code.",
        });
      }

      const hashedPassword = await hashPassword(password);
      const updateResult = await queryPromise(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashedPassword, email]
      );

      if (updateResult.changedRows > 0) {
        await DeleteCode(code, "ForGot");

        return res.status(200).send({
          success: true,
          message: "Password successfully updated. Please logined",
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "Failed to update password.",
        });
      }
    }

    return res.status(400).send({
      success: false,
      message: "Either password and code are required for password reset.",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred during the process.",
    });
  }
}

module.exports = forgotRouteController;
