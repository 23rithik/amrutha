const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Login = require('../model/login');
const Patient = require('../model/parent'); // Or Pediatrician based on user type
const verifyToken = require('../middleware/verifyToken'); // Auth middleware

router.put('/password/change', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  const userType = req.user.type;

  try {
    const login = await Login.findById(userId);
    if (!login) return res.status(404).json({ success: false, message: 'User not found' });

    const match = await bcrypt.compare(oldPassword, login.password);
    if (!match) return res.status(400).json({ success: false, message: 'Incorrect old password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    login.password = hashedPassword;
    await login.save();

    if (userType === 'parent' && login.parent_id) {
      await Patient.findByIdAndUpdate(login.parent_id, { password: hashedPassword });
    }

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
