// routes/pasien.routes.js
const express = require('express');
const router = express.Router();
// Kita gunakan controller yang sama karena logikanya terkait
const controller = require('../controllers/pemeriksaan.controller');
const { mockAuth } = require('../middleware/auth');

// Terapkan middleware autentikasi
router.use(mockAuth);

// GET /v1/pasien/:id/riwayat (Get Riwayat Pemeriksaan Pasien) [cite: 411]
router.get('/:id/riwayat', controller.getRiwayatPasien);

// ... (endpoint /pasien lainnya) ...

module.exports = router;