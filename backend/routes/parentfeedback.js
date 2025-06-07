const express = require('express');
const router = express.Router();
const Feedback = require('../model/Feedback');
const Patient = require('../model/parent');

// Submit feedback
router.post('/parentfeedback/', async (req, res) => {
  try {
    const { message, parent_id } = req.body;

    // Fetch the patient to get parent_name (username)
    const patient = await Patient.findById(parent_id);
    if (!patient) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    // Use patient.parent_name as username
    const feedback = new Feedback({
      username: patient.parent_name,
      message,
      parent_id,
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get feedbacks by parent ID
router.get('/parentfeedback/:parentId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ parent_id: req.params.parentId }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

module.exports = router;
