// models/Feedback.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  username: String,
  message: String,
  reply: String,
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient' // or 'Login' if linked with Login collection
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
