const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const Patient = require('../model/parent');
const Activity = require('../model/Activity');
const Login = require('../model/login');
const Pediatrician = require('../model/pediatrician'); // Assuming you have a Pediatrician model

// Ensure upload directories exist
const photoDir = 'uploads/photos/';
const pdfDir = 'uploads/medical_history/';
[photoDir, pdfDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'child_photo') cb(null, photoDir);
        else if (file.fieldname === 'medical_history_pdf') cb(null, pdfDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });
const multiUpload = upload.fields([
    { name: 'child_photo', maxCount: 1 },
    { name: 'medical_history_pdf', maxCount: 1 }
]);

// Registration Route
router.post('/patients/register', multiUpload, async (req, res) => {
    try {
        const {
            parent_name,
            child_name,
            address,
            phone_number,
            emailid,
            password
        } = req.body;

        const child_photo = req.files['child_photo']?.[0]?.path;
        const medical_history_pdf = req.files['medical_history_pdf']?.[0]?.path;

        if (!child_photo || !medical_history_pdf) {
            return res.status(400).json({ error: 'Photo and medical history PDF are required' });
        }

        // 🔒 Check if email already exists in login collection
        const existingLogin = await Login.findOne({ username: emailid });
        if (existingLogin) {
            return res.status(400).json({ error: 'Email already registered in login database' });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Save to Parent (Patient) collection
        const newPatient = new Patient({
            parent_name,
            child_name,
            address,
            phone_number,
            emailid,
            password: hashedPassword,
            child_photo,
            medical_history_pdf,
            status: 'not selected',
            pediatrician_id: null
        });

        const savedPatient = await newPatient.save();

        // ✅ Save to Login collection
        const newLogin = new Login({
            username: emailid,
            password: hashedPassword,
            type: 'parent',
            status: 0,
            parent_id: savedPatient._id
        });

        await newLogin.save();

        res.status(201).json({ message: 'Patient and login registered successfully' });

    } catch (err) {
        console.error('Error during patient registration:', err);
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});


// GET parent status
router.get('/parent/status/:id', async (req, res) => {
  try {
    console.log("Fetching status for parent ID:", req.params.id);
    const parent = await Patient.findById(req.params.id);
    console.log("dataaaa:",parent);
    console.log("Parent found:", parent.status);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }   

    return res.json({ status: parent.status });
  } catch (err) {
    console.error('Error fetching parent status:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET all pediatricians
router.get('/pediatricians', async (req, res) => {
  try {
    // Exclude the password field using projection
    const pediatricians = await Pediatrician.find({}, '-password');
    res.json(pediatricians);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT - update parent's status and assign pediatrician
router.put('/parent/select-pediatrician/:parentId', async (req, res) => {
  try {
    const { pediatricianId } = req.body;
    const parentId = req.params.parentId;

    // Fetch the parent document first
    const parent = await Patient.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Update the parent document
    const updated = await Patient.findByIdAndUpdate(
      parentId,
      {
        status: 'selected',
        pediatrician_id: pediatricianId,
      },
      { new: true }
    );

    // Insert activity log with parent name
    await Activity.create({
      userType: 'patient',
      userId: parentId,
      action: 'Selected Pediatrician',
      details: `Parent ${parent.parent_name} selected pediatrician with ID: ${pediatricianId}`,
    });

    res.json({ message: 'Pediatrician selected successfully', data: updated });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get parent's name by ID
router.get('/parent/name/:id', async (req, res) => {
  try {
    const parent = await Patient.findById(req.params.id).select('parent_name'); // Only fetch name
    // console.log("Parent name:", parent);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    return res.json({ name: parent.parent_name });
    
  } catch (err) {
    console.error('Error fetching parent name:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/patient/photo/:parentId', async (req, res) => {
  try {
    const parentId = req.params.parentId;
    // console.log("Fetching child photo for parent ID:", parentId);
    // Find patient record by parent ID
    const patient = await Patient.findOne({ _id: parentId });
    // console.log("Patient record:", patient);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Return just the child_photo field (e.g. filename)
    res.json({ child_photo: patient.child_photo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
