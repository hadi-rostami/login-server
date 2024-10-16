const jwt = require("jsonwebtoken");

function createTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
}

const verifyAccessToken = (accessToken) => {
  try {
    return jwt.verify(accessToken, process.env.SECRET_KEY);
  } catch (error) {
    return error;
  }
};

const verifyRereshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
  } catch (error) {
    return error;
  }
};

module.exports = { createTokens, verifyAccessToken, verifyRereshToken };
