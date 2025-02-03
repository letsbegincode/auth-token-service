const OTP = require("../models/OTP");
const { generateOTP, sendOTP } = require("./otpService");

const createOTPRecord = async (email) => {
  const code = generateOTP();
  await OTP.create({
    email,
    otp: code,
    expiresAt: new Date(Date.now() + 60 * 1000) 
  });
  await sendOTP(email, code);
  return code;
};

const verifyOTP = async (email, otp) => {
  try {
    const otpRecord = await OTP.findOne({ email, otp: parseInt(otp) });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return null;
    }
    return otpRecord;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error; 
  }
};

const deleteOTP = async (email) => {
  await OTP.deleteMany({ email });
};

module.exports = { createOTPRecord, verifyOTP, deleteOTP };