// Utility function to log user activity
const AuditLog = require("../models/AuditLogs");

exports.logUserActivity = async (userId, action, req) => {
    try {
      await AuditLog.findOneAndUpdate(
        { userId },
        {
          $push: {
            logs: {
              action,
              ipAddress: req.ip,
              userAgent: req.get("User-Agent"),
              timestamp: new Date()
            }
          }
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      logError("error", "Failed to log user activity", { error: error.message, stack: error.stack });
    }
  };