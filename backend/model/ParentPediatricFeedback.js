// models/PediatricFeedback.js

const mongoose = require('mongoose');

const parentpediatricFeedbackSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    default: '', // reply might be empty initially
  },
  pediatrician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pediatric', // adjust if your pediatrician model name differs
    required: true,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient', // adjust if your patient model name differs
    required: true,
  },
}, {
  timestamps: true, // optional but recommended for tracking createdAt and updatedAt
});

module.exports = mongoose.model('ParentPediatricFeedback', parentpediatricFeedbackSchema);
