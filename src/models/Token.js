const mongoose = require('mongoose');

// Define schema
const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date, // Expiration date for the refresh token
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false, // Used to invalidate tokens
    },
  },
  { timestamps: true }
);

// Export model
module.exports = mongoose.model('Token', TokenSchema);
