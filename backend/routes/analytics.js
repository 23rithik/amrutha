// routes/analytics.js

const express = require('express');
const router = express.Router();
const Feedback = require('../model/Feedback');
const PediatricFeedback = require('../model/PediatricFeedback');

router.get('/feedback', async (req, res) => {
  try {
    // Example: Retrieve feedback data and group it by month
    const feedbacks = await Feedback.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Prepare dates and counts for the frontend
    const dates = feedbacks.map(fb => new Date(0, fb._id - 1).toLocaleString('default', { month: 'short' }));
    const feedbackCounts = feedbacks.map(fb => fb.count);

    res.json({ dates, feedbackCounts });
  } catch (error) {
    console.error('Error fetching feedback analytics:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
