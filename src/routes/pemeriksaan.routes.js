const express = require('express');
const router = express.Router();

// Import Controller
const pemeriksaanController = require('../controllers/pemeriksaan.controller');

// Import Middleware Auth (Pastikan path-nya sesuai dengan struktur folder Anda)
// Jika belum ada isinya, Anda bisa men-comment baris ini dulu.
const verifyToken = require('../middleware/auth');

// ==================================================================
// DEFINISI ROUTES
// ==================================================================

// Middleware: Lindungi semua route di bawah ini (User harus Login dulu)
// Sesuai API Spec "security: - BearerAuth: []"
//router.use(verifyToken); 

// 1. GET / (Opsional/Admin) - Mengambil semua data pemeriksaan
// Ini menggunakan fungsi yang kita buat di langkah sebelumnya
router.get('/', pemeriksaanController.getAllPemeriksaan);

// 2. POST / - Membuat Catatan Pemeriksaan SOAP Baru (FR-03)
// Sesuai API Spec: POST /pemeriksaan
router.post('/', pemeriksaanController.createPemeriksaan);

// 3. GET /:id - Mengambil Detail Catatan SOAP
// Sesuai API Spec: GET /pemeriksaan/{id}
router.get('/:id', pemeriksaanController.getDetailPemeriksaan);

// 4. PUT /:id - Mengupdate Catatan SOAP
// Sesuai API Spec: PUT /pemeriksaan/{id}
router.put('/:id', pemeriksaanController.updatePemeriksaan);

module.exports = router;