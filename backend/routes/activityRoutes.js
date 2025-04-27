require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Activity = require('../model/Activity');
const SECRET = process.env.JWT_SECRET;

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// ✅ Route to get activities (admin only)
router.get('/activities', verifyToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const activities = await Activity.find()
      .populate('userId') // Automatically resolves either patient or pediatrician
      .sort({ timestamp: -1 });

    // Format user name/email based on userType
    const formattedActivities = activities.map(activity => {
      let name = 'Unknown';
      let emailid = 'Unknown';

      if (activity.userType === 'patient' && activity.userId) {
        name = activity.userId.parent_name;
        emailid = activity.userId.emailid;
      } else if (activity.userType === 'pediatrician' && activity.userId) {
        name = activity.userId.name;
        emailid = activity.userId.emailid;
      }

      return {
        _id: activity._id,
        userType: activity.userType,
        action: activity.action,
        timestamp: activity.timestamp,
        details: activity.details,
        userInfo: { name, emailid }
      };
    });

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
