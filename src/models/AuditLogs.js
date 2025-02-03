const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // One document per user
  },
  logs: [
    {
      action: {
        type: String, // Example: 'LOGIN', 'LOGOUT', 'UPDATE_PROFILE'
        required: true,
      },
      ipAddress: {
        type: String,
      },
      userAgent: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ]
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
