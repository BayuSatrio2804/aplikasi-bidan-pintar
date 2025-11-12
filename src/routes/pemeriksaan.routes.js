// routes/pemeriksaan.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/pemeriksaan.controller');
// const { validatePemeriksaan } = require('../middleware/validators'); // <--- DIHAPUS
const { mockAuth } = require('../middleware/auth');

// Terapkan middleware autentikasi ke semua rute di file ini
router.use(mockAuth);

// POST /v1/pemeriksaan (Buat Catatan SOAP Baru)
// Tidak ada validasi di sini, ditangani di controller
router.post('/', controller.createPemeriksaan);

// GET /v1/pemeriksaan/:id (Get Detail Catatan SOAP)
router.get('/:id', controller.getPemeriksaanById);

// PUT /v1/pemeriksaan/:id (Update Catatan SOAP)
// Tidak ada validasi di sini, ditangani di controller
router.put('/:id', controller.updatePemeriksaan);

module.exports = router;