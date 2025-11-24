// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');
const validator = require('../middleware/validator.middleware');
const { RegisterSchema, LoginSchema, UpdateProfileSchema } = require('../validators/auth.validator');

// Endpoint Publik
router.post('/register', validator(RegisterSchema), authController.register);
router.post('/login', validator(LoginSchema), authController.login);

// Endpoint Terlindungi
router.get('/me', verifyToken, authController.getProfile); 
router.put('/me', verifyToken, validator(UpdateProfileSchema), authController.updateProfile);

module.exports = router;