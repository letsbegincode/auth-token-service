const ServerLog = require('../models/log');

// GET /health/error
// Retrieves all logs with level 'error'
exports.getErrorLogs = async (req, res) => {
  try {
    const errorLogs = await ServerLog.find({ level: 'error' }).sort({ timestamp: -1 });
    res.status(200).json({
      count: errorLogs.length,
      logs: errorLogs
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to retrieve error logs',
      message: err.message
    });
  }
};

// GET /health/status
// Retrieves all logs (all levels) from the database
exports.getStatusLogs = async (req, res) => {
  try {
    const allLogs = await ServerLog.find({}).sort({ timestamp: -1 });
    res.status(200).json({
      count: allLogs.length,
      logs: allLogs
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to retrieve status logs',
      message: err.message
    });
  }
};
