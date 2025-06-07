


const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Hospital = require('../model/Hospital');
const Patient = require('../model/parent');


// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/hospitals/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// Add hospital referral
router.post('/hospitals/add', upload.single('hospital_image'), async (req, res) => {
  try {
    const { pediatrician_id, parent_id, hospital_name, address, phone_number, website, description } = req.body;

    const newHospital = new Hospital({
      pediatrician_id,
      parent_id,
      hospital_name,
      address,
      phone_number,
      website,
      description,
      hospital_image: req.file ? req.file.path : ''
    });

    await newHospital.save();
    res.status(201).json({ message: 'Hospital referred successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding hospital' });
  }
});

// ✅ Leave this route as it is
router.get('/hospitals/:parentId', async (req, res) => {
  try {
    const referrals = await Hospital.find({ parent_id: req.params.parentId });
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching referrals' });
  }
});

router.get('/patients/byPediatrician/:id', async (req, res) => {
  try {
    const patients = await Patient.find({
      pediatrician_id: req.params.id,
      status: 'selected' // optional: only show selected
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching patients' });
  }
});

router.delete('/hospitals/:id', async (req, res) => {
  try {
    const deleted = await Hospital.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Referral not found' });
    res.json({ message: 'Referral deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting referral' });
  }
});


module.exports = router;
