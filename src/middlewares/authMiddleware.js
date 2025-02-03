const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify access token
exports.verifyAccessToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check for admin role
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
