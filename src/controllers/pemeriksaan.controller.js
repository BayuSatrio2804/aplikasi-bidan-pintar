const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const VALID_LAYANAN = ["ANC", "KB", "Imunisasi", "Persalinan", "Nifas"];

// --- 1. GET List Semua Pemeriksaan ---
const getAllPemeriksaan = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pemeriksaan ORDER BY tanggal_pemeriksaan DESC');
        
        res.status(200).json({
            message: 'Berhasil mengambil data pemeriksaan',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- 2. POST Buat Catatan Pemeriksaan SOAP Baru (FR-03, FR-06) ---
const createPemeriksaan = async (req, res) => {
    const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = req.body;
    
    // VALIDASI FR-06
    if (!id_pasien || !jenis_layanan || !subjektif || !objektif || !analisa || !tatalaksana) {
        return res.status(400).json({ 
            message: 'Validasi gagal: Data wajib tidak lengkap (ID Pasien, Jenis Layanan, atau salah satu bagian SOAP kosong).'
        });
    }

    if (!VALID_LAYANAN.includes(jenis_layanan)) {
         return res.status(400).json({ 
            message: 'Jenis layanan tidak valid.'
        });
    }
    
    const id_pemeriksaan = uuidv4();

    try {
        const [pasienCheck] = await db.query('SELECT id_pasien FROM pasien WHERE id_pasien = ?', [id_pasien]);
        if (pasienCheck.length === 0) {
            return res.status(404).json({ message: 'ID Pasien tidak ditemukan.' });
        }
        
        const query = `
            INSERT INTO pemeriksaan 
            (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        await db.query(query, [id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana]);

        res.status(201).json({
            message: 'Catatan pemeriksaan berhasil disimpan.',
            data: { id_pemeriksaan, ...req.body, tanggal_pemeriksaan: new Date().toISOString() }
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menyimpan data pemeriksaan.', error: error.message });
    }
};

// --- 3. GET Detail Catatan SOAP ---
const getDetailPemeriksaan = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM pemeriksaan WHERE id_pemeriksaan = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Data pemeriksaan tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Detail catatan SOAP ditemukan',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- 4. PUT Update Catatan SOAP ---
const updatePemeriksaan = async (req, res) => {
    const { id } = req.params;
    const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = req.body;

    // VALIDASI FR-06
    if (!id_pasien || !jenis_layanan || !subjektif || !objektif || !analisa || !tatalaksana) {
        return res.status(400).json({ 
            message: 'Validasi gagal: Data wajib tidak lengkap.'
        });
    }

    try {
        const [check] = await db.query('SELECT * FROM pemeriksaan WHERE id_pemeriksaan = ?', [id]);
        if (check.length === 0) {
            return res.status(404).json({ message: 'Data pemeriksaan tidak ditemukan' });
        }
        
        const [pasienCheck] = await db.query('SELECT id_pasien FROM pasien WHERE id_pasien = ?', [id_pasien]);
        if (pasienCheck.length === 0) {
            return res.status(404).json({ message: 'ID Pasien baru tidak ditemukan.' });
        }

        const query = `
            UPDATE pemeriksaan SET 
            id_pasien = ?, jenis_layanan = ?, subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ? 
            WHERE id_pemeriksaan = ?
        `;
        
        await db.query(query, [id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, id]);

        res.status(200).json({
            message: 'Catatan SOAP berhasil diperbarui.',
            data: { id_pemeriksaan: id, ...req.body }
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengupdate catatan SOAP.', error: error.message });
    }
};

module.exports = {
    getAllPemeriksaan,
    createPemeriksaan,
    getDetailPemeriksaan,
    updatePemeriksaan
};