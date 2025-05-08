const express = require('express');
const router = express.Router();
const Activity = require('../model/Activity');
const Patient = require('../model/parent');
const Pediatrician = require('../model/pediatrician');

// GET /api/activities
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });

    const populatedActivities = await Promise.all(activities.map(async (activity) => {
      let userInfo = null;

      if (activity.userType === 'patient') {
        userInfo = await Patient.findById(activity.userId).select('parent_name');
      } else if (activity.userType === 'pediatrician') {
        userInfo = await Pediatrician.findById(activity.userId).select('name');
      }

      return {
        ...activity.toObject(),
        userInfo,
      };
    }));

    res.json(populatedActivities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

module.exports = router;
