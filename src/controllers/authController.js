const User = require("../models/User");
const { registerSchema, loginSchema,updatePasswordSchema } = require("../validations/userValidation");
const { asyncHandler, handleDuplicateError } = require("../utils/errorHandler");
const { generateTokens, saveRefreshToken, COOKIE_OPTIONS } = require("../utils/authHelpers");
const { createOTPRecord, verifyOTP, deleteOTP } = require("../utils/otpHelpers");
const { logUserActivity } = require("../utils/logUserActivity");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) return handleDuplicateError(res, "Username or Email already exists");

  await createOTPRecord(email);
  res.status(200).json({ message: "OTP sent to email. Verify to complete registration." });
});

exports.verifyRegister = asyncHandler(async (req, res) => {
  const { username, email, otp, password } = req.body;

  const otpRecord = await verifyOTP(email, otp);
  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return handleDuplicateError(res, "User already exists");

  const user = await User.create({ username, email, password });
  console.log('user created')
  const { accessToken, refreshToken } = generateTokens(user._id);
  console.log("access token geenreted")
  await saveRefreshToken(user._id, refreshToken);
  console.log("saved refresh token")
  await logUserActivity(user._id, "REGISTER", req);
  console.log("logged user activity")

  // Delete OTP record after successful registration
  await deleteOTP(email);
  console.log("deleted otp")

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
  res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });
});

exports.login = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.isValidPassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  await createOTPRecord(email);
  res.status(200).json({ message: "OTP sent. Verify to login." });
});

exports.verifyLogin = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Verify OTP
  if (!(await verifyOTP(email, otp))) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  await deleteOTP(email);

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token to DB
  await saveRefreshToken(user._id, refreshToken);
  await logUserActivity(user._id, "LOGIN", req);

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

  res.status(200).json({ accessToken });
});


exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const storedToken = await Token.findOne({ userId: decoded.id, token: refreshToken });

  if (!storedToken || storedToken.isRevoked) {
    return res.status(403).json({ error: "Invalid or revoked refresh token" });
  }

  const newAccessToken = generateTokens(decoded.id).accessToken;
  res.status(200).json({ accessToken: newAccessToken });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const userId = decoded.id;

  await Token.deleteOne({ refreshToken }); // Correct field name

  await logUserActivity(userId, "LOGOUT", req);

  console.log("User logged out:", userId);

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});



exports.updatePassword = asyncHandler(async (req, res) => {
  // Validate input using Joi
  const { error } = updatePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, currentPassword, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!(await user.isValidPassword(currentPassword))) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(hashedPassword)
  const updatedUser = await User.findOneAndUpdate(
    { email }, // Filter
    { password: hashedPassword }, // Update
    { new: true, runValidators: true } // Options
  );
  
  if (!updatedUser) {
    return res.status(500).json({ error: "Failed to update password. Try again." });
  }

  // Log the activity
  await logUserActivity(user._id, "UPDATE_PASSWORD", req);

  res.status(200).json({ message: "Password updated successfully" });
});