const bcrypt = require("bcryptjs");

// هش کردن پسورد
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// بررسی پسورد
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, verifyPassword };
