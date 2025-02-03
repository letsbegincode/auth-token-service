const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'], // Role-based access control
      default: 'user',
    },
    isMFAEnabled: {
      type: Boolean,
      default: false, // To check if MFA is enabled for the user
    },
    mfaSecret: {
      type: String, // Stores the secret for MFA (e.g., OTP or TOTP)
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to validate password
UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Export model
module.exports = mongoose.model('User', UserSchema);
