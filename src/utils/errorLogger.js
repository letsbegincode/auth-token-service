const ServerLog = require("../models/log");

/**
 * Logs an error message into the database.
 * @param {String} level - The severity level (e.g., "error", "warn", "info").
 * @param {String} message - The error message.
 * @param {Object} meta - Additional metadata (e.g., stack trace, request details).
 */
const logError = async (level, message, meta = {}) => {
  try {
    await ServerLog.create({
      level,
      message,
      meta,
    });
  } catch (dbError) {
    console.error("Failed to log error:", dbError);
  }
};

module.exports = logError;
