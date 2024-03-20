const nodemailer = require("nodemailer");
require("dotenv").config();

function sendEmail(from, to, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    tls: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter.sendMail({
    from,
    to,
    subject,
    html: htmlContent,
  });
}

module.exports = { sendEmail };
