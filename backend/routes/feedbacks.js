const express = require('express');
const router = express.Router();
const Feedback = require('../model/Feedback');
const PediatricFeedback = require('../model/PediatricFeedback');

// Get all feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin reply to feedback
router.put('/feedbacks/:id', async (req, res) => {
  try {
    const { reply } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );
    res.json(updatedFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get feedback analytics
router.get('/analytics', async (req, res) => {
  try {
    const feedbackCount = await Feedback.countDocuments();
    const pediatricFeedbackCount = await PediatricFeedback.countDocuments();

    res.json({
      feedbackCount,
      pediatricFeedbackCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router;
