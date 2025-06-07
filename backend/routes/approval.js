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

    // Fetch login status for all parents
    const loginData = await Login.find({ type: 'parent' }, 'parent_id status').lean();

    // Create a mapping from parent ID to login status
    const loginStatusMap = loginData.reduce((acc, login) => {
      acc[login.parent_id?.toString()] = login.status;
      return acc;
    }, {});

    // Normalize image/PDF paths and attach login_status to each parent
    const enrichedParents = parents
      .filter(parent => parent.parent_name !== 'Admin')
      .map(parent => ({
        ...parent._doc,
        child_photo: `http://localhost:4000/${parent.child_photo.replace(/\\/g, '/')}`,
        medical_history_pdf: `http://localhost:4000/${parent.medical_history_pdf.replace(/\\/g, '/')}`,
        login_status: loginStatusMap[parent._id.toString()] ?? 0 // default to 0 (pending) if not found
      }));

    res.json(enrichedParents);
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

    const { id } = req.params;
    const { status } = req.body;

    // Find the parent by ID
    const parent = await Parent.findById(id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Update the corresponding login status
    const login = await Login.findOneAndUpdate(
      { parent_id: id },
      { status },
      { new: true }
    );

    if (!login) {
      return res.status(404).json({ message: 'Associated login record not found' });
    }

    // Create an activity log
    const statusMap = {
      1: 'Approved',
      2: 'Rejected',
      3: 'Deactivated',
      0: 'Pending'
    };

    const activity = new Activity({
      userType: 'patient',
      userId: id,
      action: `Status ${statusMap[status] || 'Updated'}`,
      details: `Admin ${statusMap[status]?.toLowerCase()} the account of parent "${parent.parent_name}".`,
    });

    await activity.save();

    res.json({ success: true, message: 'Status updated and activity logged.', login });

  } catch (error) {
    console.error('Error updating status:', error);
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
    const logins = await Login.find({ type: 'pediatrician' });

    const formatted = pediatricians.map(p => {
      const login = logins.find(l => l.pediatrician_id?.toString() === p._id.toString());

      return {
        ...p._doc,
        license_pdf: `http://localhost:4000/${p.license_pdf.replace(/\\/g, '/')}`,
        login_status: login?.status ?? 0 // fallback to 0 (Pending)
      };
    });

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

    // Fetch pediatrician
    const pediatrician = await Pediatrician.findById(id);
    if (!pediatrician) {
      return res.status(404).json({ success: false, message: 'Pediatrician not found' });
    }

    // Update status in Pediatrician model
    const updatedPediatrician = await Pediatrician.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // Update status in Login model
    await Login.findOneAndUpdate(
      { pediatrician_id: id },
      { status }
    );

    // Map numeric status to action
    const statusMap = {
      1: 'Approved',
      2: 'Rejected',
      3: 'Deactivated',
      0: 'Pending'
    };

    const activity = new Activity({
      userType: 'pediatrician',
      userId: pediatrician._id,
      action: `Status ${statusMap[status] || 'Updated'}`,
      details: `Admin ${statusMap[status]?.toLowerCase()} the account of pediatrician "${pediatrician.name}".`,
    });

    await activity.save();

    res.json({ 
      success: true,
      message: `Pediatrician ${statusMap[status]?.toLowerCase() || 'status updated'} successfully`,
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
