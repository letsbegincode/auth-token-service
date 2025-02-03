const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
// const authMiddleware = require('../middlewares/authMiddleware');

// GET /audit-log/ - Retrieve all audit logs (for all users)
router.get('/', auditLogController.getAllAuditLogs);

// In your routes file (e.g., src/routes/auditLog.js)
router.get('/username/:username', auditLogController.getAuditLogByUsername);

// GET /audit-log/:userId - Retrieve audit logs for a specific user
router.get('/:userId', auditLogController.getAuditLogByUser);


module.exports = router;
