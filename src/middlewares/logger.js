// src/middlewares/logger.js

// Load environment variables
require('dotenv').config();

const winston = require('winston');
require('winston-mongodb'); // Import the MongoDB transport

// Debug: Ensure that the MONGO_URI is available (remove this line in production)
console.log('MongoDB URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in your environment variables.");
}

// Create a custom JSON log format with timestamp
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create a logger instance that writes to both Console and MongoDB
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: logFormat,
  transports: [
    // Console transport logs to terminal
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),  // For easier reading in the console
        winston.format.simple()
      )
    }),
    // MongoDB transport logs to the specified MongoDB collection
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,        // Use the MONGO_URI from the environment
      collection: 'serverLogs',           // Collection name where logs will be stored
      level: 'info',                      // Log level for MongoDB transport
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Optional: Create a stream function for integration with HTTP logging libraries like Morgan.
logger.stream = {
  write: (message) => {
    // Remove extra newlines and log as info
    logger.info(message.trim());
  },
};

module.exports = logger;
