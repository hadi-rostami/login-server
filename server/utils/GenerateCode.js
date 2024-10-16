const queryPromise = require('./QueryPromise')

async function generateCode(email, type) {
  try {
    const code = Math.floor(Math.random() * 900000 + 100000)
    const expirationTime = Date.now() + 10 * 60 * 1000;

    // برسی وجود داشتن کد
    const [result] = await queryPromise(
      "SELECT * FROM codes WHERE email = ? AND type = ?",
      [email, type]
    );

    if (result === undefined) {
      // ساخت کد جدید برای لاگین

      await queryPromise(
        "INSERT INTO codes(email, code, create_at , type) VALUES (?, ?, ?, ?)",
        [email, code, expirationTime, type]
      );
    } else {

      //  یرسی انقضای کد قبلی و ارسال ان
      const currentTime = Date.now();
      if (currentTime < result.create_at) {
        return result.code;
      }

      // اپدیت کد جدید برای لاگین
      await queryPromise(
        "UPDATE codes SET create_at = ?, code = ? WHERE email = ? AND type = ?",
        [expirationTime, code, email, type]
      );
    }

    return code;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Database Error");
  }
}


module.exports = generateCode