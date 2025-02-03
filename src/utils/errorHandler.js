const logError = require("./errorLogger");

const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch((error) => {
    logError("error", error.message, { stack: error.stack });
    res.status(500).json({ error: "Server error" });
  });

const handleDuplicateError = (res, message) => 
  res.status(400).json({ error: message });

module.exports = {
  asyncHandler,
  handleDuplicateError
};