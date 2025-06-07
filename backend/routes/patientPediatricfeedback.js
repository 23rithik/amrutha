const express = require('express');
const router = express.Router();
const PediatricFeedback = require('../model/PediatricFeedback');
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

module.exports = router;
