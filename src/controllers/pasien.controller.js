const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// 1. GET List Pasien & Search (FR-04)
// API Spec: GET /pasien?search=...
const getAllPasien = async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM pasien';
        let params = [];

        // Logika Pencarian (Search by Nama or NIK)
        if (search) {
            query += ' WHERE nama LIKE ? OR nik LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC'; // Urutkan dari yang terbaru

        const [rows] = await db.query(query, params);

        res.status(200).json({
            message: 'Berhasil mengambil data pasien',
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. POST Tambah Pasien Baru (FR-02)
// API Spec: POST /pasien
const createPasien = async (req, res) => {
    const { nama, nik, umur, alamat, no_hp } = req.body;

    // Validasi Input Wajib (Sesuai SRS FR-06)
    if (!nama || !nik || !umur || !alamat || !no_hp) {
        return res.status(400).json({ message: 'Semua data wajib diisi (Nama, NIK, Umur, Alamat, No HP)' });
    }

    // Validasi Format NIK (Sesuai SRS Tabel Kebutuhan Teknis)
    if (nik.length !== 16) {
        return res.status(400).json({ message: 'NIK harus terdiri dari 16 digit angka' });
    }

    const id_pasien = uuidv4();

    try {
        const query = `INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)`;
        
        await db.query(query, [id_pasien, nama, nik, umur, alamat, no_hp]);

        res.status(201).json({
            message: 'Pasien berhasil ditambahkan',
            data: { id_pasien, ...req.body }
        });
    } catch (error) {
        // Menangkap Error Duplicate NIK (Karena di Database NIK diset UNIQUE)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'NIK sudah terdaftar, silakan cek kembali.' });
        }
        res.status(500).json({ message: 'Gagal menyimpan data', error: error.message });
    }
};

// 3. GET Detail Pasien
// API Spec: GET /pasien/{id}
const getPasienById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM pasien WHERE id_pasien = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Detail pasien ditemukan',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. PUT Update Data Pasien
// API Spec: PUT /pasien/{id}
const updatePasien = async (req, res) => {
    const { id } = req.params;
    const { nama, nik, umur, alamat, no_hp } = req.body;

    try {
        // Cek apakah pasien ada
        const [check] = await db.query('SELECT * FROM pasien WHERE id_pasien = ?', [id]);
        if (check.length === 0) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }

        const query = `UPDATE pasien SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?`;
        
        await db.query(query, [nama, nik, umur, alamat, no_hp, id]);

        res.status(200).json({
            message: 'Data pasien berhasil diperbarui',
            data: { id, ...req.body }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'NIK sudah digunakan oleh pasien lain.' });
        }
        res.status(500).json({ message: 'Gagal update data', error: error.message });
    }
};

// 5. DELETE Hapus Pasien
// API Spec: DELETE /pasien/{id}
const deletePasien = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM pasien WHERE id_pasien = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }

        res.status(200).json({ message: 'Pasien berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
};

// 6. GET Riwayat Pemeriksaan Pasien (FR-08)
// API Spec: GET /pasien/{id}/riwayat
const getRiwayatPasien = async (req, res) => {
    const { id } = req.params;

    try {
        // Join tabel pemeriksaan dengan pasien (opsional, tapi di sini kita ambil pemeriksaan saja sesuai FK)
        const query = `SELECT * FROM pemeriksaan WHERE id_pasien = ? ORDER BY tanggal_pemeriksaan DESC`;
        const [rows] = await db.query(query, [id]);

        res.status(200).json({
            message: `Riwayat pemeriksaan untuk pasien ID: ${id}`,
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil riwayat', error: error.message });
    }
};

module.exports = {
    getAllPasien,
    createPasien,
    getPasienById,
    updatePasien,
    deletePasien,
    getRiwayatPasien
};