// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON body
app.use(express.json());

// --- Impor Rute ---
const pemeriksaanRoutes = require('./routes/pemeriksaan.routes');
const pasienRoutes = require('./routes/pasien.routes');

// --- Gunakan Rute ---
// Sesuai server URL di API spec: https://api.bidan-digital.com/v1
app.use('/v1/pemeriksaan', pemeriksaanRoutes);
app.use('/v1/pasien', pasienRoutes);

// --- Server Listener ---
app.listen(PORT, () => {
  console.log(`Server SI Bidan berjalan di http://localhost:${PORT}`);
});