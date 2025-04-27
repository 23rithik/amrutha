const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const Patient = require('../model/parent');
const Login = require('../model/login');

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
            medical_history_pdf
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

module.exports = router;
