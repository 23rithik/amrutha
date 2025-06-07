// routes/pediatricFeedbacks.js

const express = require('express');
const router = express.Router();
const PediatricFeedback = require('../model/PediatricFeedback');
const Activity = require('../model/Activity');
const Pediatrician = require('../model/pediatrician');  // Import Pediatrician model

// POST: Pediatrician submits feedback to admin
router.post('/pediatric-feedbacks', async (req, res) => {
  try {
    const { message, pediatrician_id } = req.body;
    console.log('Received feedback:', req.body);

    if (!message || !pediatrician_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch pediatrician's name
    const pediatrician = await Pediatrician.findById(pediatrician_id).select('name');
    if (!pediatrician) {
      return res.status(404).json({ error: 'Pediatrician not found' });
    }

    const newFeedback = new PediatricFeedback({
      username: pediatrician.name,
      message,
      pediatrician_id,
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error saving pediatric feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});


// GET: Get all feedbacks for a pediatrician
router.get('/pediatric-feedbacks/:pediatricianId', async (req, res) => {
  try {
    const feedbacks = await PediatricFeedback.find({ pediatrician_id: req.params.pediatricianId }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// PUT: Pediatrician edits their feedback reply to admin reply (optional)
// (If you want pediatrician to edit their own reply to admin's reply - but usually admin replies are one-way)
router.put('/pediatric-feedbacks/reply/:id', async (req, res) => {
  try {
    const { reply } = req.body;
    // You can modify this if pediatricians can edit only their feedback message, or reply to admin's reply
    const updated = await PediatricFeedback.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




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
