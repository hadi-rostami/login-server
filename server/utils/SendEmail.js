require("dotenv").config();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const generateCode = require("./GenerateCode");

async function sendCode(email, type) {
  const code = await generateCode(email, type);
  try {
    const transporterOptions = {
      service: "gmail",
      // service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    const transporter = nodemailer.createTransport(transporterOptions);

    //   // دریافت template ایمیل
    const templatePath = path.join("./server/html", "login.html");
    let htmlContent = fs.readFileSync(templatePath, "utf-8");
    htmlContent = htmlContent.replace("{{code}}", code);

    //   // دیتا های ارسالی با ایمیل
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Login Code In family-bots.ir",
      html: htmlContent,
    };

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await transporter.sendMail(mailOptions);
        return true;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    return false;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
}

module.exports = sendCode;
