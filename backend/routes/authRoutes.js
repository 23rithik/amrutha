require('dotenv').config(); // ⬅️ Load .env variables

const express = require('express');
const router = express.Router();
const Login = require('../model/login');
const Patient = require('../model/parent');
const Pediatrician = require('../model/pediatrician');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET; // ⬅️ Use env variable

// POST /api/login
// POST /api/login
router.post('/login', async (req, res) => {
    const { emailid, password } = req.body;
  
    try {
      const user = await Login.findOne({ username: emailid });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
      // ✅ Check if the user is approved
      if (user.status == 0) {
        return res.status(403).json({ message: 'User not approved by admin' });
      }
      if (user.status == 2) {
        return res.status(403).json({ message: 'User rejected by admin' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      let userId = null;
  
      if (user.type === 'parent' && user.parent_id) {
        userId = user.parent_id;
      } else if (user.type === 'pediatrician' && user.pediatrician_id) {
        userId = user.pediatrician_id;
      } else if (user.type === 'admin') {
        userId = user._id;
      }
  
      const token = jwt.sign(
        { id: userId, type: user.type },
        SECRET,
        { expiresIn: '1d' }
      );
  
      res.json({
        token,
        userType: user.type,
        userId
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

// GET /api/patients/:id
router.get('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/pediatricians/:id
router.get('/pediatricians/:id', async (req, res) => {
  try {
    const doc = await Pediatrician.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Pediatrician not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
