// models/Feedback.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  username: String,
  message: String,
  reply: String,
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient', // or 'Login' if linked with Login collection
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
