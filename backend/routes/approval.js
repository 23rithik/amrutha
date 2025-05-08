require('dotenv').config();
const express = require('express');
const router = express.Router();
const Login = require('../model/login');
const Parent = require('../model/parent');
const jwt = require('jsonwebtoken');
const Pediatrician = require('../model/pediatrician');
const Activity = require('../model/Activity');

const SECRET = process.env.JWT_SECRET;

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Token is required' });
  }

  const token = authHeader.split(' ')[1]; // <-- Take the actual token part

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};


// ✅ GET all registered parents (excluding Admin) with normalized file paths
router.get('/all-parents', verifyToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    let parents = await Parent.find();

    // Normalize paths and prefix with the correct subdirectory URL
    parents = parents
      .filter(parent => parent.parent_name !== 'Admin')
      .map(parent => ({
        ...parent._doc,
        child_photo: `http://localhost:4000/${parent.child_photo.replace(/\\/g, '/')}`,
        medical_history_pdf: `http://localhost:4000/${parent.medical_history_pdf.replace(/\\/g, '/')}`,
      }));

    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parents', error: error.message });
  }
});


// ✅ Update status (approve/reject)
router.put('/parents/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const { id } = req.params; // This is the parent_id (from Patient collection)
    const { status } = req.body;

    // Find and update the corresponding login record
    const login = await Login.findOneAndUpdate(
      { parent_id: id }, // Find by parent_id reference
      { status },       // Update the status
      { new: true }     // Return the updated document
    );

    if (!login) {
      return res.status(404).json({ message: 'Associated login record not found' });
    }

    res.json(login);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});


// ✅ GET all registered pediatricians with normalized license path
router.get('/all-pediatricians', verifyToken, async (req, res) => {
    try {
      if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
      }
  
      const pediatricians = await Pediatrician.find();
  
      const formatted = pediatricians.map(p => ({
        ...p._doc,
        license_pdf: `http://localhost:4000/${p.license_pdf.replace(/\\/g, '/')}`
      }));
  
      res.json(formatted);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pediatricians', error: error.message });
    }
  });
  
// Update pediatrician status with activity recording
router.put('/pediatricians/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied, admin only' });
    }

    const { id } = req.params;
    const { status } = req.body;

    // First get pediatrician details
    const pediatrician = await Pediatrician.findById(id);
    if (!pediatrician) {
      return res.status(404).json({ success: false, message: 'Pediatrician not found' });
    }

    // Update both Pediatrician and Login records
    const updatedPediatrician = await Pediatrician.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    await Login.findOneAndUpdate(
      { pediatrician_id: id },
      { status }
    );

    // Record activity
    try {
      const action = status === 1 ? 'Pediatrician Approved' : 'Pediatrician Rejected';
      const activity = new Activity({
        userType: 'admin',
        userId: req.user.id,
        action,
        details: `Pediatrician: ${pediatrician.name} (ID: ${id})`
      });
      
      await activity.save();
      console.log('Activity recorded:', activity); // Debug log
    } catch (activityError) {
      console.error('Activity recording failed:', activityError);
    }

    res.json({ 
      success: true,
      message: `Pediatrician ${status === 1 ? 'approved' : 'rejected'} successfully`,
      data: updatedPediatrician
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating status',
      error: error.message 
    });
  }
});




module.exports = router;
