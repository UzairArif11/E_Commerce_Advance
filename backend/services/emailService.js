// services/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config/env');

// const transporter = nodemailer.createTransport({
//   host: config.SMTP_HOST,
//   port: config.SMTP_PORT,
//   secure: false, // use true for 465, false for other ports
//   auth: {
//     user: config.SMTP_USER,
//     pass: config.SMTP_PASS,
//   },
// });
// Create a transporter using Gmail's SMTP service
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
  });
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"eCommerce App" <${config.SMTP_USER}>`,
    to: email,
    subject: 'Email Verification - Your OTP Code',
    text: `Your OTP code for email verification is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
const sendEmail = async (options) => {
  const mailOptions = {
    from: `"eCommerce App" <${config.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail ,sendEmail};
