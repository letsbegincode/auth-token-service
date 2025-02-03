const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));          // Authentication routes
router.use('/audit-log', require('./auditlogs')); // Audit log routes
router.use('/health', require('./health'));      // Health check route

module.exports = router;
