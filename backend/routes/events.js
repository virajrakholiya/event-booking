const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createEvent, bookEvent, getAllEvents } = require('../controllers/eventController');

// Create event
router.post('/', auth, createEvent);

// Book event
router.post('/:eventId/book', auth, bookEvent);

// Get all events
router.get('/', getAllEvents);

module.exports = router; 