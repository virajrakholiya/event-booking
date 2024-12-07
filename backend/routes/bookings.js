const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/booking');

router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('event')
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 