const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// --- 1. GET List & Filter Jadwal ---
const listJadwal = async (req, res) => {
    const { bulan, tahun, layanan } = req.query; 

    try {
        let query = `
            SELECT 
                j.id_jadwal, j.tanggal, j.jam_mulai, j.jam_selesai, j.jenis_layanan,
                p.nama as nama_pasien, 
                u.nama_lengkap as nama_petugas
            FROM jadwal j
            JOIN pasien p ON j.id_pasien = p.id_pasien
            JOIN users u ON j.id_petugas = u.id_user
            WHERE 1=1 
        `;
        let params = [];

        if (bulan && tahun) {
            query += ' AND MONTH(j.tanggal) = ? AND YEAR(j.tanggal) = ?';
            params.push(bulan, tahun);
        }
        if (layanan) {
            query += ' AND j.jenis_layanan = ?';
            params.push(layanan);
        }

        query += ' ORDER BY j.tanggal ASC, j.jam_mulai ASC';

        const [rows] = await db.query(query, params);

        res.status(200).json({
            message: 'Berhasil mengambil data jadwal',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- 2. POST Buat Jadwal Baru ---
const createJadwal = async (req, res) => {
    const { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai } = req.body;
    
    if (!id_pasien || !id_petugas || !jenis_layanan || !tanggal || !jam_mulai) {
        return res.status(400).json({ 
            message: 'Data wajib tidak lengkap (Pasien, Petugas, Layanan, Tanggal, Jam Mulai).' 
        });
    }

    const id_jadwal = uuidv4();

    try {
        const query = `
            INSERT INTO jadwal 
            (id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai]);

        res.status(201).json({
            message: 'Jadwal berhasil dibuat',
            data: { id_jadwal, ...req.body }
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat jadwal', error: error.message });
    }
};

// --- 3. GET Detail Jadwal ---
const getDetailJadwal = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                j.*,
                p.nama as nama_pasien, 
                u.nama_lengkap as nama_petugas
            FROM jadwal j
            JOIN pasien p ON j.id_pasien = p.id_pasien
            JOIN users u ON j.id_petugas = u.id_user
            WHERE j.id_jadwal = ?
        `;
        
        const [rows] = await db.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Data jadwal tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Detail jadwal ditemukan',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- 4. PUT Update Jadwal ---
const updateJadwal = async (req, res) => {
    const { id } = req.params;
    const { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai } = req.body;

    if (!id_pasien || !id_petugas || !jenis_layanan || !tanggal || !jam_mulai) {
        return res.status(400).json({ 
            message: 'Data wajib tidak lengkap (Pasien, Petugas, Layanan, Tanggal, Jam Mulai).' 
        });
    }

    try {
        const [check] = await db.query('SELECT id_jadwal FROM jadwal WHERE id_jadwal = ?', [id]);
        if (check.length === 0) {
            return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
        }

        const query = `
            UPDATE jadwal SET 
            id_pasien = ?, id_petugas = ?, jenis_layanan = ?, tanggal = ?, jam_mulai = ?, jam_selesai = ? 
            WHERE id_jadwal = ?
        `;
        
        await db.query(query, [id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai, id]);

        res.status(200).json({
            message: 'Jadwal berhasil diperbarui',
            data: { id_jadwal: id, ...req.body }
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal update jadwal', error: error.message });
    }
};

// --- 5. DELETE Hapus Jadwal ---
const deleteJadwal = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM jadwal WHERE id_jadwal = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
        }

        res.status(204).json({ message: 'Jadwal berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus jadwal', error: error.message });
    }
};

module.exports = {
    listJadwal,
    createJadwal,
    getDetailJadwal,
    updateJadwal,
    deleteJadwal
};