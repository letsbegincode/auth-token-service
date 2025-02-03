const jwt = require("jsonwebtoken");
const Token  = require("../models/Token");

// Token generation
const generateTokens = (userId) => ({
  accessToken: jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" }),
  refreshToken: jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
});

// Token saving
const saveRefreshToken = async (userId, refreshToken) => {
  try {
    console.log("User ID Type:", typeof userId);
    console.log("User ID:", userId);

    await Token.create({
      userId,
      refreshToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error("Error saving refresh token:", error);
    throw error; 
  }
};

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

module.exports = {
  generateTokens,
  saveRefreshToken,
  COOKIE_OPTIONS
};