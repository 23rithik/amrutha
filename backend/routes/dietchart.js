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

// POST route to add a diet chart
router.post('/dietchart/add', async (req, res) => {
  try {
    const { parent_id, pediatrician_id, week } = req.body;

    const newChart = new DietChart({
      parent_id,
      pediatrician_id,
      week,
    });
    await newChart.save();
    res.status(201).json({ message: 'Diet chart added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete diet chart
router.delete('/dietchart/:id', async (req, res) => {
  try {
    await DietChart.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting chart' });
  }
});



module.exports = router;
