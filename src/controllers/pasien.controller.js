const pasienService = require('../services/pasien.service');

// 1. GET List Pasien & Search
const getAllPasien = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await pasienService.getAllPasien(search); 
        res.status(200).json({ message: 'Berhasil mengambil data pasien', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. POST Tambah Pasien Baru (Validasi ditangani oleh Middleware)
const createPasien = async (req, res) => {
    try {
        const newPasien = await pasienService.createPasien(req.body); 
        res.status(201).json({ message: 'Pasien berhasil ditambahkan', data: newPasien });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'NIK sudah terdaftar, silakan cek kembali.' });
        }
        res.status(500).json({ message: 'Gagal menyimpan data', error: error.message });
    }
};

// 3. GET Detail Satu Pasien
const getPasienById = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pasienService.getPasienById(id);
        if (!data) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }
        res.status(200).json({ message: 'Detail pasien ditemukan', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. PUT Update Pasien (Validasi ditangani oleh Middleware)
const updatePasien = async (req, res) => {
    const { id } = req.params;
    try {
        // Pengecekan keberadaan Pasien (sebelum update)
        const existingPasien = await pasienService.getPasienById(id);
        if (!existingPasien) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan. Gagal update.' });
        }

        const updatedPasien = await pasienService.updatePasien(id, req.body);
        
        res.status(200).json({ message: 'Data pasien berhasil diperbarui', data: updatedPasien });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'NIK sudah terdaftar di pasien lain.' });
        }
        res.status(500).json({ message: 'Gagal memperbarui data', error: error.message });
    }
};

// 5. DELETE Hapus Pasien
const deletePasien = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pasienService.deletePasien(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan. Gagal hapus.' });
        }
        res.status(200).json({ message: 'Pasien berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
};

// 6. GET Riwayat Pemeriksaan Pasien (FR-08)
const getRiwayatPasien = async (req, res) => {
    const { id } = req.params;
    try {
        const existingPasien = await pasienService.getPasienById(id);
        if (!existingPasien) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan.' });
        }
        const riwayat = await pasienService.getRiwayatPasien(id);
        
        res.status(200).json({
            message: `Riwayat pemeriksaan untuk pasien ${existingPasien.nama} berhasil diambil`,
            data: riwayat
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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