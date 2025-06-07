const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  pediatrician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pediatric',
    required: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
    required: true
  },
  hospital_name: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
  website: { type: String },
  description: { type: String },
  hospital_image: { type: String }, // image file path
}, { timestamps: true });

// Explicitly set collection name to "hospitals"
module.exports = mongoose.model('Hospital', hospitalSchema, 'hospitals');
