const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const logger = require('./src/middlewares/logger');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Connect to MongoDB (your connection logic)
const connectDB = require('./src/database/connection');
connectDB();

const app = express();

// Use Morgan for HTTP request logging and pipe logs to Winston
app.use(morgan('combined', { stream: logger.stream }));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// all routes
app.use('/api', routes);

// Fallback route
app.use('/', (req, res) => {
  res.status(200).json({ message: 'put valid  API  req' });
});

// Error handling middleware (always at the end)
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
