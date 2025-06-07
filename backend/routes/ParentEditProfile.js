const express = require('express');
const router = express.Router();
const Patient = require('../model/parent');
const Login = require('../model/login');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'child_photo') cb(null, 'uploads/photos/');
    else cb(null, 'uploads/medical_history/');
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// Update patient profile
router.put('/patient/profile/update/:id', upload.fields([
  { name: 'child_photo', maxCount: 1 },
  { name: 'medical_history_pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      parent_name, child_name, address,
      phone_number, emailid, password
    } = req.body;

    const patient = await Patient.findById(req.params.id);
    const login = await Login.findOne({ parent_id: req.params.id });

    if (!patient || !login) return res.status(404).json({ error: 'Patient not found' });

    // ✅ Update child_photo if new one is uploaded
    if (req.files.child_photo && req.files.child_photo[0]) {
      if (patient.child_photo) {
        const oldPhotoPath = path.join('uploads/photos/', patient.child_photo);
        if (fs.existsSync(oldPhotoPath)) fs.unlinkSync(oldPhotoPath);
      }
      patient.child_photo = path.join('uploads/photos', req.files.child_photo[0].filename);
    }

    // ✅ Update medical_history_pdf if new one is uploaded
    if (req.files.medical_history_pdf && req.files.medical_history_pdf[0]) {
      if (patient.medical_history_pdf) {
        const oldPdfPath = path.join('uploads/medical_history/', patient.medical_history_pdf);
        if (fs.existsSync(oldPdfPath)) fs.unlinkSync(oldPdfPath);
      }
      patient.medical_history_pdf = path.join('uploads/medical_history', req.files.medical_history_pdf[0].filename);

    }

    // ✅ Update fields
    patient.parent_name = parent_name;
    patient.child_name = child_name;
    patient.address = address;
    patient.phone_number = phone_number;
    patient.emailid = emailid;

    login.username = emailid;

    // ✅ Hash and update password if provided
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      const hashedPwd = await bcrypt.hash(password, salt);
      patient.password = hashedPwd;
      login.password = hashedPwd;
    }

    await patient.save();
    await login.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get patient profile
router.get('/patient/profile/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const login = await Login.findOne({ parent_id: req.params.id });

    res.json({
      _id: patient._id,
      parent_name: patient.parent_name,
      child_name: patient.child_name,
      address: patient.address,
      phone_number: patient.phone_number,
      emailid: patient.emailid,
      child_photo: patient.child_photo,
      medical_history_pdf: patient.medical_history_pdf,
      status: patient.status,
      password: login.password // ⚠️ consider omitting this in production
    });

  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
