const express = require('express');
const router = express.Router();

// Endpoint Publik
router.post('/register', authController.register);
router.post('/login', authController.login);

// Endpoint Terlindungi (Membutuhkan Token)
router.get('/me', verifyToken, authController.getProfile); // Asumsi ada getProfile di controller
router.put('/me', verifyToken, authController.updateProfile); // Asumsi ada updateProfile di controller

module.exports = router;