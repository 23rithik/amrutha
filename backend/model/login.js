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
    ref: 'Patient' // optional: only if you're referencing Patient
  },
  pediatrician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pediatrician'
  }
  
}, { collection: 'logins' }); // 👈 This ensures the collection name is exactly 'logins'

module.exports = mongoose.model('Login', loginSchema);
