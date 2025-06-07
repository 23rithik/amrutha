const express = require('express');
const router = express.Router();
const Pediatrician = require('../model/pediatrician');
const Login = require('../model/login');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Storage for license uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/licenses/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ GET Pediatrician Profile Info
router.get('/pediatric/profile/view/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const pediatrician = await Pediatrician.findById(pid);
    if (!pediatrician) return res.status(404).json({ message: 'Not found' });

    res.json({
      name: pediatrician.name,
      emailid: pediatrician.emailid,
      phone_number: pediatrician.phone_number,
      address: pediatrician.address,
      license_number: pediatrician.license_number,
      license_pdf: pediatrician.license_pdf ? path.basename(pediatrician.license_pdf) : null
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ PUT Update Profile (with/without password, with/without PDF)
router.put('/pediatric/profile/edit/:pid', upload.single('license_pdf'), async (req, res) => {
  try {
    const { pid } = req.params;
    const {
      name,
      emailid,
      phone_number,
      address,
      license_number,
      password
    } = req.body;

    const pediatrician = await Pediatrician.findById(pid);
    const login = await Login.findOne({ pediatrician_id: pid });

    if (!pediatrician || !login) return res.status(404).json({ error: 'Not found' });

    // Replace file if a new license is uploaded
    if (req.file) {
      if (pediatrician.license_pdf) {
        const oldPath = path.join('uploads/licenses', path.basename(pediatrician.license_pdf));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      pediatrician.license_pdf = path.join('uploads/licenses', req.file.filename);
    }

    pediatrician.name = name;
    pediatrician.emailid = emailid;
    pediatrician.phone_number = phone_number;
    pediatrician.address = address;
    pediatrician.license_number = license_number;

    login.username = emailid;

    // Update password only if provided
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      login.password = hashed;
    }

    await pediatrician.save();
    await login.save();

    res.json({ message: 'Profile successfully updated' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
