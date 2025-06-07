const express = require('express');
const router = express.Router();
const DietChart = require('../model/DietChart');

// Get diet chart for parent
router.get('/dietchart/:parentId', async (req, res) => {
  try {
    const charts = await DietChart.find({ parent_id: req.params.parentId }).populate('pediatrician_id', 'name');
    res.json(charts);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
