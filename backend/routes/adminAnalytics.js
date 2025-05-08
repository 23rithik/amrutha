const express = require('express');
const router = express.Router();
const Patient = require('../model/parent');
const Pediatrician = require('../model/pediatrician');
const Activity = require('../model/Activity');
const Login = require('../model/login');

// Total System Analytics
router.get('/performance/analytics', async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalPediatricians = await Pediatrician.countDocuments();
    const totalUsers = totalPatients + totalPediatricians;

    const newRegistrations = await Login.countDocuments({ status: 1 });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivities = await Activity.find({
      timestamp: { $gte: thirtyDaysAgo },
    });

    const activeUserIds = new Set(recentActivities.map(act => act.userId.toString()));
    const activeUsers = activeUserIds.size;

    const systemMetrics = {
      serverUptime: '99.9%',
      apiSuccessRate: '98%',
      databaseHealth: 'Good',
    };

    res.status(200).json({
      totalUsers,
      totalPatients,
      totalPediatricians,
      activeUsers,
      newRegistrations,
      systemMetrics,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: `Failed to fetch analytics data: ${error.message}` });
  }
});

// Weekly Stats (for charts)
router.get('/performance/weekly-stats', async (req, res) => {
  try {
    const today = new Date();
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(today.getDate() - 42);

    // New Registrations grouped by ISO Week
    const newRegistrations = await Login.aggregate([
      {
        $match: {
          status: 1,
          createdAt: { $gte: sixWeeksAgo }
        }
      },
      {
        $group: {
          _id: { $isoWeek: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Activities grouped by ISO Week
    const activities = await Activity.aggregate([
      {
        $match: {
          timestamp: { $gte: sixWeeksAgo }
        }
      },
      {
        $group: {
          _id: { $isoWeek: "$timestamp" },
          activeUsers: { $addToSet: "$userId" }
        }
      },
      {
        $project: {
          week: "$_id",
          activeUsersCount: { $size: "$activeUsers" },
          _id: 0
        }
      },
      { $sort: { week: 1 } }
    ]);

    // Calculate the last 6 ISO week numbers
    const lastSixWeeks = getLastSixWeekNumbers();
    const chartData = [];

    for (const week of lastSixWeeks) {
      const reg = newRegistrations.find(item => item._id === week);
      const act = activities.find(item => item.week === week);

      chartData.push({
        week: `Week ${week}`,
        newRegistrations: reg ? reg.count : 0,
        activeUsers: act ? act.activeUsersCount : 0
      });
    }

    res.status(200).json(chartData);
  } catch (error) {
    console.error('Error generating weekly stats:', error);
    res.status(500).json({ error: 'Failed to generate weekly stats' });
  }
});

// Helper: Get last 6 ISO week numbers
function getWeekNumberFromDate(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const millisBetween = date.getTime() - onejan.getTime();
  const days = Math.floor(millisBetween / (24 * 60 * 60 * 1000));
  return Math.ceil((days + onejan.getDay() + 1) / 7);
}

function getLastSixWeekNumbers() {
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    result.push(getWeekNumberFromDate(d));
  }
  return result;
}

module.exports = router;
