// backend/routes/generateMedication.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/predict', async (req, res) => {
  try {
    const { symptoms } = req.body;
    const response = await axios.post('http://localhost:5001/predict', { symptoms });
    res.json(response.data);
  } catch (err) {
    console.error('ML API Error:', err.message);
    res.status(500).json({ error: 'Enter valid symptoms' });
  }
});

module.exports = router;
