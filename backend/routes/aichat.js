// routes/aichat.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/aichat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'medllama2:latest', // use the name of the pulled model
      prompt: message,
      stream: false,
    });

    const reply = response.data.response || 'Sorry, AI did not respond.';
    console.log('AI reply:', reply);
    res.json({ reply });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ reply: 'AI is currently unavailable. Please try again later.' });
  }
});

module.exports = router;
