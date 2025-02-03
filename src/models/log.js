const mongoose = require('mongoose');

const serverLogSchema = new mongoose.Schema({
  level: { type: String },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
  meta: { type: mongoose.Schema.Types.Mixed }  // Any extra data
}, { collection: 'serverLogs' }); // Use the same collection used by Winston

module.exports = mongoose.model('ServerLog', serverLogSchema);

