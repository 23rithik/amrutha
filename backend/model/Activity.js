  const mongoose = require('mongoose');

  const activitySchema = new mongoose.Schema({
    userType: { // 'patient' or 'pediatrician'
      type: String,
      required: true,
      enum: ['patient', 'pediatrician'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userType', // Dynamically references either Patient or Pediatrician
    },
    action: {
      type: String,
      required: true, // E.g., "Registered", "Profile Updated", "Password Changed"
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: String, // Any additional details about the activity
      default: '',
    },
  });

  const Activity = mongoose.model('Activity', activitySchema);

  module.exports = Activity;
