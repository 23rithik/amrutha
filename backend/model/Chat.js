const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
    required: true
  },
  pediatrician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pediatric',
    default: null // initially null
  },
  sender: {
    type: String,
    enum: ['parent', 'pediatrician'],
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
