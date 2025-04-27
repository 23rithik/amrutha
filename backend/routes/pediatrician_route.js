const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const pediatriciandata = require('../model/pediatrician');
const Login = require('../model/login');

// Ensure upload directory exists
const licenseDir = 'uploads/licenses/';
if (!fs.existsSync(licenseDir)) fs.mkdirSync(licenseDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, licenseDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Registration Route
router.post('/pediatricians/register', upload.single('license_pdf'), async (req, res) => {
    try {
        const { name, emailid, password, license_number, phone_number, address } = req.body;
        const license_pdf = req.file?.path;

        // 🔒 Check if email already exists in login collection
        const existingLogin = await Login.findOne({ username: emailid });
        if (existingLogin) {
            return res.status(400).json({ error: 'Email already registered in login database' });
        }

        // ✅ Continue registration
        const hashedPassword = await bcrypt.hash(password, 10);

        const newPediatrician = new pediatriciandata({
            name,
            emailid,
            password: hashedPassword,
            license_number,
            phone_number,
            address,
            license_pdf
        });

        const savedPediatrician = await newPediatrician.save();

        await Login.create({
            username: emailid,
            password: hashedPassword,
            type: 'pediatrician',
            status: 0,
            pediatrician_id: savedPediatrician._id
        });

        res.status(201).json({ message: 'Pediatrician registered successfully' });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});

module.exports = router;
