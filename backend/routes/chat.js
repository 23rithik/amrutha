const express = require('express');
const router = express.Router();
const Chat = require('../model/Chat');
const Patient = require('../model/parent'); // Make sure to import your Patient model
const Pediatrician = require('../model/pediatrician'); // Adjust path as needed
const Activity = require('../model/Activity'); // Import Activity model


// POST: Send a message
router.post('/chat/send', async (req, res) => {
  try {
    const { parent_id, sender, message } = req.body;

    // Find the patient by parent_id
    const patient = await Patient.findById(parent_id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Extract pediatrician_id from patient document
    const pediatrician_id = patient.pediatrician_id;

    // Create new chat message
    const chatMessage = new Chat({
      parent_id,
      pediatrician_id: pediatrician_id || null,
      sender,
      message,
    });

    await new Activity({
      userType: 'patient',
      userId: parent_id,
      action: 'Sent Message',
      details: `${patient.parent_name} sent a message to pediatrician.`,
    }).save();


    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Message sending failed' });
  }
});

// GET: Get chat messages for a parent
router.get('/chat/:parentId', async (req, res) => {
  try {
    const { parentId } = req.params;

    const messages = await Chat.find({ parent_id: parentId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetching messages failed' });
  }
});

router.get('/chat/pediatrician/:pediatricianId', async (req, res) => {
  try {
    const { pediatricianId } = req.params;

    // Find all chat messages where pediatrician_id equals this pediatricianId
    // Sorted by creation time
    const messages = await Chat.find({ pediatrician_id: pediatricianId })
      .sort({ createdAt: 1 })
      .populate('parent_id', 'parent_name'); // Optionally populate parent name
    console.log('the message is',messages);

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetching messages failed' });
  }
});

router.get('/pediatrician/profile/:id', async (req, res) => {
  try {
    const pediatricianId = req.params.id;
    const pediatrician = await Pediatrician.findById(pediatricianId).select('name photo');

    if (!pediatrician) {
      return res.status(404).json({ message: 'Pediatrician not found' });
    }

    res.json({
      name: pediatrician.name,
      photo: pediatrician.photo, // filename or URL string saved in DB
    });
  } catch (error) {
    console.error('Error fetching pediatrician profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;