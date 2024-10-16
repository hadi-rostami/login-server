const queryPromise = require("./QueryPromise");

/**
 * @param {string} code
 * @param {string} type
 * @returns {Promise<boolean>}
 */
async function checkCode(code, type) {
  const [result] = await queryPromise(
    "SELECT * FROM codes WHERE code = ? AND type = ?",
    [code, type]
  );

  if (!result) {
    return false;
  }

  const currentTime = Date.now();
  if (currentTime > result.create_at) {
    return false;
  }

  return true;
}

/**
 * @param {string} code
 * @param {string} type
 */
async function DeleteCode(code, type) {
  await queryPromise("delete from codes where code = ? AND type = ?", [
    code,
    type,
  ]);
}

module.exports = {checkCode , DeleteCode};
