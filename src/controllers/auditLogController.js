const AuditLog = require('../models/AuditLogs');
const User = require('../models/User');
const logError = require("../utils/errorLogger");

// Get all audit logs for all users
exports.getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('userId', 'username email');
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs', message: error.message });
  }
};

// Get audit logs for a specific user
exports.getAuditLogByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const log = await AuditLog.findOne({ userId }).populate('userId', 'username email');
    if (!log) {
      return res.status(404).json({ message: 'No audit logs found for this user' });
    }
    res.status(200).json({ auditLog: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit log', message: error.message });
  }
};

exports.getAuditLogByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    // Find the user first by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Now find the audit log document for that user
    const auditLog = await AuditLog.findOne({ userId: user._id });
    if (!auditLog) {
      return res.status(404).json({ message: 'No audit logs found for this user' });
    }
    res.status(200).json({ auditLog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit log', message: error.message });
  }
};
