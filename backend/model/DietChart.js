const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  time: String,          // e.g., '08:00 AM'
  food: String           // e.g., 'Mashed banana'
});

const daySchema = new mongoose.Schema({
  day: String,           // e.g., 'Monday'
  meals: [mealSchema]    // Array of meals for the day
});

const dietChartSchema = new mongoose.Schema({
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
    required: true
  },
  pediatrician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pediatric',
    required: true
  },
  week: [daySchema],     // 7-day diet plan
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DietChart', dietChartSchema);
