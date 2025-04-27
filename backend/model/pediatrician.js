const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Activity = require('./Activity'); // Import Activity model

const pediatricSchema = new mongoose.Schema({
  emailid: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  license_number: {
    type: String,
    required: true,
  },
  license_pdf: {
    type: String, // Path or URL to the uploaded license PDF
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to hash password
pediatricSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Log activity when a pediatrician registers or updates their profile
pediatricSchema.post('save', async function (doc) {
  try {
    await Activity.create({
      userType: 'pediatrician',
      userId: doc._id,
      action: this.isNew ? 'Registered' : 'Profile Updated',
      details: `Pediatrician ${this.name} registered/updated their profile.`,
    });
  } catch (err) {
    console.error('Error logging activity:', err);
  }
});

const Pediatrician = mongoose.model('pediatric', pediatricSchema);

module.exports = Pediatrician;
