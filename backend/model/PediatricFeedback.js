// models/PediatricFeedback.js

const mongoose = require('mongoose');

const pediatricFeedbackSchema = new mongoose.Schema({
  username: String,
  message: String,
  reply: String,
  pediatrician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pediatrician' // adjust if your collection name differs
  }
});

module.exports = mongoose.model('PediatricFeedback', pediatricFeedbackSchema);
