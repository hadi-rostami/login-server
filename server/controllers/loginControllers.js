const queryPromise = require("../utils/QueryPromise");
const { createTokens } = require("../utils/CreateTokenAndVerify");
const { verifyPassword } = require("../utils/HashOrVerifyPass");

async function loginRouteController(req, res) {
  const { email, password } = req.body;
  //
  if (!email) {
    return res.status(400).send({
      success: false,
      message: "Email is required.",
    });
  }

  if (!password) {
    return res.status(400).send({
      success: false,
      message: "Either password is required.",
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
        message: "User not registered or incorrect email.",
      });
    }

    const result = await verifyPassword(password, user.password);

    if (!result) {
      return res.status(400).send({
        success: false,
        message: "Incorrect password.",
      });
    }

    const { accessToken, refreshToken } = createTokens(`${user.id}`);

    res.header("access-token", accessToken);
    res.header("refresh-token", refreshToken);
    // اگر کد معتبر بود، ورود موفقیت آمیز
    return res.status(200).send({
      success: true,
      message: "Login successful!",
    });
  } catch (error) {

    console.log(error);
    

    return res.status(500).send({
      success: false,
      message: "An error occurred during the login process.",
    });
  }
}

module.exports = loginRouteController;
