const crypto = require("crypto");
const nodemailer = require("nodemailer");
const OTP = require("../models/OTP");

const generateOTP = () => crypto.randomInt(100000, 999999); // Keeping it as a Number

const sendOTP = async (email, otp) => {

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Node Mailer - OTP Verification",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
  });
};

module.exports = { generateOTP, sendOTP };
