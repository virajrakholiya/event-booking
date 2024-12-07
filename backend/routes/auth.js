const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const User = require('../models/user');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Add this new route to get user data
router.get('/me', me);

module.exports = router; 