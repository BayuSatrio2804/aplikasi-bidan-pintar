// src/routes/laporan.routes.js

const express = require('express');
const router = express.Router();

// Import Controller dan Middleware
const laporanController = require('../controllers/laporan.controller');
const { verifyToken } = require('../middleware/auth'); 

// Middleware: Lindungi semua route Laporan
router.use(verifyToken); 

// ==================================================================
// DEFINISI ROUTES LAPORAN (FR-05)
// API Spec: GET /laporan?format=pdf|excel&bulan=...&tahun=...
// ==================================================================

// Endpoint untuk Generate Laporan Bulanan (FR-05)
router.get('/', laporanController.generateLaporanBulanan);

module.exports = router;