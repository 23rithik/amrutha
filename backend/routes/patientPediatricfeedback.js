const express = require('express');
const router = express.Router();
const PediatricFeedback = require('../model/ParentPediatricFeedback');
const Patient = require('../model/parent'); // Import Patient model

// Submit pediatrician feedback
router.post('/pediatricfeedback/', async (req, res) => {
  try {
    const { message, parent_id } = req.body;

    // Find the parent in the Patient collection
    const parent = await Patient.findById(parent_id);
    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    const pediatrician_id = parent.pediatrician_id;
    if (!pediatrician_id) {
      return res.status(400).json({ error: 'Pediatrician not assigned to this parent' });
    }

    // Use parent_name as username
    const feedback = new PediatricFeedback({
      username: parent.parent_name,
      message,
      parent_id,
      pediatrician_id
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get feedbacks by parent ID
router.get('/pediatricfeedback/:parentId', async (req, res) => {
  try {
    const feedbacks = await PediatricFeedback.find({ parent_id: req.params.parentId }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Get feedbacks by pediatrician ID (new route)
router.get('/pediatricfeedback/pediatrician/:pediatricianId', async (req, res) => {
  try {
    const feedbacks = await PediatricFeedback.find({ pediatrician_id: req.params.pediatricianId }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Update reply of a feedback by its ID
router.put('/pediatricfeedback/reply/:feedbackId', async (req, res) => {
  try {
    const { reply } = req.body;
    const feedback = await PediatricFeedback.findById(req.params.feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    feedback.reply = reply;
    await feedback.save();
    res.json({ message: 'Reply updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reply' });
  }
});

module.exports = router;
