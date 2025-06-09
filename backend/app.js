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
const passwordRoutes = require('./routes/password');
const chatRoutes = require('./routes/chat');
const EditPatientProfile = require('./routes/ParentEditProfile');
const hospitalRoutes = require('./routes/hospital'); // Assuming you have a hospital route
const dietRoutes = require('./routes/dietchart'); // Assuming you have a diet route
const parentfeedbackroute = require('./routes/parentfeedback'); // Parent profile edit route
const parentPediatricianRoute = require('./routes/patientPediatricfeedback'); // Parent pediatrician route
const pediatricianProfile = require('./routes/pediatricianProfile'); // Pediatrician profile route
const aichat = require('./routes/aichat'); // AI Chatbot route


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
app.use('/api', passwordRoutes);
app.use('/api', chatRoutes);
app.use('/api', EditPatientProfile);
app.use('/api', hospitalRoutes); // Hospital routes
app.use('/api', dietRoutes); // Diet chart routes
app.use('/api', parentfeedbackroute); // Parent profile edit route
app.use('/api', parentPediatricianRoute); // Parent pediatrician route
app.use('/api', pediatricianProfile); // Pediatrician profile route
app.use('/api', aichat); // AI Chatbot route


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
