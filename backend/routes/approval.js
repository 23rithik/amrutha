require('dotenv').config();
const express = require('express');
const router = express.Router();
const Login = require('../model/login');
const Parent = require('../model/parent');
const jwt = require('jsonwebtoken');
const Pediatrician = require('../model/pediatrician');

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

    const { id } = req.params;
    const { status } = req.body;

    const login = await Login.findByIdAndUpdate(id, { status }, { new: true });
    if (!login) return res.status(404).json({ message: 'Parent not found' });

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
  
  // ✅ Update pediatrician status (approve/reject)
  router.put('/pediatricians/:id/status', verifyToken, async (req, res) => {
    try {
      if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
      }
  
      const { id } = req.params;
      const { status } = req.body;
  
      const login = await Login.findByIdAndUpdate(id, { status }, { new: true });
      if (!login) return res.status(404).json({ message: 'Pediatrician not found' });
  
      res.json(login);
    } catch (error) {
      res.status(500).json({ message: 'Error updating status', error: error.message });
    }
  });


module.exports = router;
