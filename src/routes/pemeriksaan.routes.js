const express = require('express');
const router = express.Router();

// Import Controller
const pemeriksaanController = require('../controllers/pemeriksaan.controller');

// Import Middleware Auth (HARUS DI SINI)
const { verifyToken } = require('../middleware/auth'); 

// ==================================================================
// DEFINISI ROUTES
// ==================================================================

// Middleware: Lindungi semua route di bawah ini (User harus Login dulu)
// Sesuai API Spec "security: - BearerAuth: []"
router.use(verifyToken); // <--- verifyToken kini terdefinisi

// 1. GET / (Opsional/Admin) - Mengambil semua data pemeriksaan
router.get('/', pemeriksaanController.getAllPemeriksaan);

// 2. POST / - Membuat Catatan Pemeriksaan SOAP Baru (FR-03)
router.post('/', pemeriksaanController.createPemeriksaan);

// 3. GET /:id - Mengambil Detail Catatan SOAP
router.get('/:id', pemeriksaanController.getDetailPemeriksaan);

// 4. PUT /:id - Mengupdate Catatan SOAP
router.put('/:id', pemeriksaanController.updatePemeriksaan);

module.exports = router;