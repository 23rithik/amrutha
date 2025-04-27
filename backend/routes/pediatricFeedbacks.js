// routes/pediatricFeedbacks.js

const express = require('express');
const router = express.Router();
const PediatricFeedback = require('../model/PediatricFeedback');

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
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
