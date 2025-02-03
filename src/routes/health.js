const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Endpoint to retrieve error logs
router.get('/error', healthController.getErrorLogs);

// Endpoint to retrieve all logs (status)
router.get('/status', healthController.getStatusLogs);

module.exports = router;
