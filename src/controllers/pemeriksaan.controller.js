// 1. Import koneksi database
const db = require('../config/database');

// Contoh fungsi untuk mengambil semua data pemeriksaan
const getAllPemeriksaan = async (req, res) => {
    try {
        // Gunakan query SQL biasa
        const [rows] = await db.query('SELECT * FROM pemeriksaan');
        
        res.status(200).json({
            message: 'Berhasil mengambil data pemeriksaan',
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Contoh fungsi untuk membuat pemeriksaan baru (Sesuai API Spec)
const createPemeriksaan = async (req, res) => {
    const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = req.body;
    
    // Generate UUID (jika tidak pakai auto-increment)
    const { v4: uuidv4 } = require('uuid'); 
    const id_pemeriksaan = uuidv4();

    try {
        const query = `
            INSERT INTO pemeriksaan 
            (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana]);

        res.status(201).json({
            message: 'Pemeriksaan berhasil disimpan',
            data: {
                id_pemeriksaan,
                ...req.body
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Gagal menyimpan data',
            error: error.message
        });
    }
};

// ... (kode import db dan fungsi create/getAll yang sudah ada sebelumnya) ...

// GET Detail Pemeriksaan
const getDetailPemeriksaan = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM pemeriksaan WHERE id_pemeriksaan = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Data pemeriksaan tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Detail pemeriksaan ditemukan',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// PUT Update Pemeriksaan
const updatePemeriksaan = async (req, res) => {
    const { id } = req.params;
    const { subjektif, objektif, analisa, tatalaksana } = req.body;

    try {
        // Cek dulu apakah data ada
        const [check] = await db.query('SELECT * FROM pemeriksaan WHERE id_pemeriksaan = ?', [id]);
        if (check.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        // Lakukan update
        await db.query(
            'UPDATE pemeriksaan SET subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ? WHERE id_pemeriksaan = ?',
            [subjektif, objektif, analisa, tatalaksana, id]
        );

        res.status(200).json({
            message: 'Data pemeriksaan berhasil diperbarui',
            data: { id, ...req.body }
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengupdate data', error: error.message });
    }
};

// JANGAN LUPA TAMBAHKAN KE MODULE EXPORTS
module.exports = {
    getAllPemeriksaan,
    createPemeriksaan,
    getDetailPemeriksaan, // <--- Tambahkan ini
    updatePemeriksaan     // <--- Tambahkan ini
};