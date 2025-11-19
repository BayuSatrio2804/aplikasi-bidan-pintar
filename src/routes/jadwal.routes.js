// src/routes/jadwal.routes.js

const express = require('express');
const router = express.Router();

// Import Controller dan Middleware
const jadwalController = require('../controllers/jadwal.controller');
const { verifyToken } = require('../middleware/auth'); 

// Middleware: Lindungi semua route Jadwal
router.use(verifyToken); 

// ==================================================================
// DEFINISI ROUTES JADWAL
// ==================================================================

// 1. GET / - List & Filter Jadwal (Sesuai Wireframe: Bulan, Tahun, Layanan)
// API Spec: GET /jadwal
router.get('/', jadwalController.listJadwal);

// 2. POST / - Buat Jadwal Baru (Sesuai Wireframe: Tombol "+ Buat Jadwal")
// API Spec: POST /jadwal
router.post('/', jadwalController.createJadwal);

// 3. GET /:id - Get Detail Jadwal (Untuk mengisi form "Edit Jadwal")
// API Spec: GET /jadwal/{id}
router.get('/:id', jadwalController.getDetailJadwal);

// 4. PUT /:id - Update Jadwal (Sesuai Wireframe: Tombol Edit)
// API Spec: PUT /jadwal/{id}
router.put('/:id', jadwalController.updateJadwal);

// 5. DELETE /:id - Hapus Jadwal (Sesuai Wireframe: Ikon tempat sampah)
// API Spec: DELETE /jadwal/{id}
router.delete('/:id', jadwalController.deleteJadwal);

module.exports = router;