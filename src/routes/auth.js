const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public Routes
router.post('/signup', authController.register); // otp generation
router.post('/vsignup', authController.verifyRegister); // User Registration
router.post('/login', authController.login);       // otp verification
router.post('/vlogin', authController.verifyLogin);       // User Login
router.post('/updatePassword', authController.updatePassword);       // User updateProfile
router.post('/logout', authController.logout);     // User Logout


// Token Management
router.post('/refresh-token', authController.refreshToken); // Issue a new access token using a refresh token

module.exports = router;
