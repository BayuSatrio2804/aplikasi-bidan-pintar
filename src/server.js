// server.js
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON body
app.use(express.json());

// --- Impor Rute ---
const authRoutes = require('./routes/auth.routes');
const pasienRoutes = require('./routes/pasien.routes');
const pemeriksaanRoutes = require('./routes/pemeriksaan.routes');
const jadwalRoutes = require('./routes/jadwal.routes');
const laporanRoutes = require('./routes/laporan.routes');
const dashboardRoutes = require('./routes/dashboard.routes'); // Dashboard Routes

// --- Gunakan Rute ---
// Sesuai server URL di API spec: https://api.bidan-digital.com/v1
app.use('/v1/auth', authRoutes);
app.use('/v1/pasien', pasienRoutes);
app.use('/v1/pemeriksaan', pemeriksaanRoutes);
app.use('/v1/jadwal', jadwalRoutes);
app.use('/v1/laporan', laporanRoutes);
app.use('/v1/dashboard', dashboardRoutes); // Tambahkan Dashboard

// --- Server Listener ---
app.listen(PORT, () => {
  console.log(`Server SI Bidan berjalan di http://localhost:${PORT}`);
});