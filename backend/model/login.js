const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 0
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  pediatrician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pediatrician'
  }
}, { collection: 'logins', timestamps: true }); // ✅ Added timestamps

module.exports = mongoose.model('Login', loginSchema);
