const express = require('express');
const router = express.Router();
const Feedback = require('../model/Feedback');
const PediatricFeedback = require('../model/PediatricFeedback');
const Activity = require('../model/Activity');

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

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Log activity for patient reply
    if (updatedFeedback.parent_id) {
      const activity = new Activity({
        userType: 'patient',
        userId: updatedFeedback.parent_id,
        action: 'Received Admin Reply',
        details: `Admin replied to feedback: "${updatedFeedback.message?.slice(0, 50)}..."`
      });
      await activity.save();
    }

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
