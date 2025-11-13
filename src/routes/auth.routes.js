// routes/auth.routes.js

const express = require('express');
const router = express.Router();

// Import Controller
const authController = require('../controllers/auth.controller');

// POST /v1/auth/register
router.post('/register', authController.register);

// POST /v1/auth/login
router.post('/login', authController.login);

module.exports = router;