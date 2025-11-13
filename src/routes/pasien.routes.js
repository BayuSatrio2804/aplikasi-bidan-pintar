const express = require('express');
const router = express.Router();

// Import Controller
const pasienController = require('../controllers/pasien.controller');

// Import Middleware Auth (Opsional, aktifkan jika login sudah siap)
const verifyToken = require('../middleware/auth');

// ==================================================================
// DEFINISI ROUTES PASIEN
// ==================================================================

// Middleware: Semua route pasien butuh login (Security BearerAuth)
//router.use(verifyToken); 

// 1. GET / - List semua pasien (mendukung ?search=nama)
// 
router.get('/', pasienController.getAllPasien);

// 2. POST / - Tambah pasien baru
// [cite: 401]
router.post('/', pasienController.createPasien);

// 3. GET /:id - Detail satu pasien
// [cite: 404]
router.get('/:id', pasienController.getPasienById);

// 4. PUT /:id - Update data pasien
// [cite: 406]
router.put('/:id', pasienController.updatePasien);

// 5. DELETE /:id - Hapus pasien
// [cite: 409]
router.delete('/:id', pasienController.deletePasien);

// 6. GET /:id/riwayat - Lihat riwayat pemeriksaan pasien tertentu
// [cite: 411]
router.get('/:id/riwayat', pasienController.getRiwayatPasien);

module.exports = router;