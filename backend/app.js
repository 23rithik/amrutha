const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
require('./db/mongodb'); // Connect to MongoDB

// Route imports
const pediatrician_route = require('./routes/pediatrician_route');
const patient_route = require('./routes/patient_route');
const authRoutes = require('./routes/authRoutes');
const approval = require('./routes/approval');
const feedbackRoutes = require('./routes/feedbacks');
const pediatricFeedbackRoutes = require('./routes/pediatricFeedbacks');
const activityRoutes = require('./routes/activityRoutes');
const adminAnalyticsRoutes = require('./routes/adminAnalytics');

// Ensure required directories exist
const uploadDir = path.join(__dirname, 'uploads/licenses');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// ✅ Static files for uploads (images, PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api', pediatrician_route);
app.use('/api', patient_route);
app.use('/api', authRoutes);
app.use('/api', approval);
app.use('/api', feedbackRoutes);
app.use('/api', pediatricFeedbackRoutes);
app.use('/api', activityRoutes);
app.use('/api', adminAnalyticsRoutes);


// ✅ Wildcard route for frontend (only after static + API routes)
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).send('Something broke!');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`${PORT} is up and running`);
});
