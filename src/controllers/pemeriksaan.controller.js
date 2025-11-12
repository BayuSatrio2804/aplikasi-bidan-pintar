// controllers/pemeriksaan.controller.js
const crypto = require('crypto'); // Untuk generate UUID palsu

// Mock Database (hanya untuk simulasi)
const db_pemeriksaan = [];
const JENIS_LAYANAN_VALID = ['ANC', 'KB', 'Imunisasi', 'Persalinan', 'Nifas'];

/**
 * Fungsi helper untuk validasi manual data SOAP
 * Sesuai FR-03, FR-06
 */
const validateSOAP = (data) => {
  const errors = [];
  
  // Cek data wajib SOAP [cite: 449]
  if (!data.id_pasien) errors.push({ field: "id_pasien", message: "id_pasien wajib diisi" });
  if (!data.jenis_layanan) errors.push({ field: "jenis_layanan", message: "jenis_layanan wajib diisi" });
  if (!data.subjektif) errors.push({ field: "subjektif", message: "subjektif wajib diisi" });
  if (!data.objektif) errors.push({ field: "objektif", message: "objektif wajib diisi" });
  if (!data.analisa) errors.push({ field: "analisa", message: "analisa wajib diisi" });
  if (!data.tatalaksana) errors.push({ field: "tatalaksana", message: "tatalaksana wajib diisi" });

  // Cek enum jenis_layanan [cite: 447]
  if (data.jenis_layanan && !JENIS_LAYANAN_VALID.includes(data.jenis_layanan)) {
     errors.push({ field: "jenis_layanan", message: "jenis_layanan tidak valid" });
  }
  
  return errors;
};

// === POST /pemeriksaan (FR-03) ===
//
exports.createPemeriksaan = async (req, res) => {
  const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = req.body;

  // Validasi Manual (FR-06)
  const validationErrors = validateSOAP(req.body);
  if (validationErrors.length > 0) {
    // Kirim notifikasi data tidak lengkap (FR-07) [cite: 178]
    return res.status(400).json({ 
      message: 'Validasi gagal (Data SOAP tidak lengkap, sesuai FR-06).', //
      errors: validationErrors
    });
  }

  // --- Logika Mock Database ---
  const newPemeriksaan = {
    id_pemeriksaan: crypto.randomUUID(),
    tanggal_pemeriksaan: new Date().toISOString(), //
    id_pasien,
    jenis_layanan,
    subjektif,
    objektif,
    analisa,
    tatalaksana
  };
  db_pemeriksaan.push(newPemeriksaan);
  // --- Akhir Logika Mock ---

  // Kirim respons 201 Created
  res.status(201).json(newPemeriksaan);
};

// === GET /pemeriksaan/:id ===
//
exports.getPemeriksaanById = async (req, res) => {
  const { id } = req.params;
  
  // Mock Data
  const mockData = {
    id_pemeriksaan: id,
    tanggal_pemeriksaan: "2025-11-12T10:00:00Z",
    id_pasien: crypto.randomUUID(),
    jenis_layanan: "ANC", //
    subjektif: "Pasien mengeluh pusing dan mual.", //
    objektif: "TD 110/70, Nadi 80x/menit.", //
    analisa: "G1P0A0, Hamil 8 minggu.", //
    tatalaksana: "Diberi vitamin B6 dan edukasi." //
  };
  
  res.status(200).json(mockData);
};

// === PUT /pemeriksaan/:id ===
//
exports.updatePemeriksaan = async (req, res) => {
  const { id } = req.params;

  // Validasi Manual (FR-06)
  const validationErrors = validateSOAP(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ 
      message: 'Validasi gagal (Data SOAP tidak lengkap, sesuai FR-06).',
      errors: validationErrors
    });
  }

  const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = req.body;

  // --- Logika Mock Database ---
  const updatedData = {
    id_pemeriksaan: id,
    tanggal_pemeriksaan: "2025-11-12T10:00:00Z", 
    id_pasien,
    jenis_layanan,
    subjektif,
    objektif,
    analisa,
    tatalaksana
  };
  // --- Akhir Logika Mock ---

  res.status(200).json(updatedData);
};

// === GET /pasien/:id/riwayat (FR-08) ===
//
exports.getRiwayatPasien = async (req, res) => {
  const { id } = req.params; // Ini adalah id_pasien

  const mockRiwayat = [
    {
      id_pemeriksaan: crypto.randomUUID(),
      tanggal_pemeriksaan: "2025-11-12T10:00:00Z",
      id_pasien: id,
      jenis_layanan: "ANC",
      subjektif: "Pusing dan mual.",
      objektif: "TD 110/70",
      analisa: "Hamil 8 minggu.",
      tatalaksana: "Vitamin B6."
    },
    {
      id_pemeriksaan: crypto.randomUUID(),
      tanggal_pemeriksaan: "2025-10-10T09:00:00Z",
      id_pasien: id,
      jenis_layanan: "KB",
      subjektif: "Ingin pasang IUD.",
      objektif: "Pemeriksaan normal.",
      analisa: "Akseptor KB IUD.",
      tatalaksana: "Pasang IUD Copper-T."
    }
  ]; //
  
  res.status(200).json(mockRiWayat);
};