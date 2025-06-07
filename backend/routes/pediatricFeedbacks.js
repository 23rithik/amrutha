// routes/pediatricFeedbacks.js

const express = require('express');
const router = express.Router();
const PediatricFeedback = require('../model/PediatricFeedback');
const Activity = require('../model/Activity');

// Get all pediatrician feedbacks
router.get('/pediatric-feedbacks', async (req, res) => {
  try {
    const feedbacks = await PediatricFeedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin reply to pediatrician feedback
router.put('/pediatric-feedbacks/:id', async (req, res) => {
  try {
    const { reply } = req.body;

    const updated = await PediatricFeedback.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Log activity for pediatrician reply
    if (updated.pediatrician_id) {
      const activity = new Activity({
        userType: 'pediatrician',
        userId: updated.pediatrician_id,
        action: 'Received Admin Reply',
        details: `Admin replied to pediatric feedback: "${updated.message?.slice(0, 50)}..."`
      });
      await activity.save();
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
