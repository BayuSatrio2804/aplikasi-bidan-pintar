const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth'); 

// Lindungi semua route dashboard
router.use(verifyToken); 

router.get('/rekap-layanan', dashboardController.getRekapLayanan);

module.exports = router;