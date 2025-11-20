const pemeriksaanService = require('../services/pemeriksaan.service');

// 1. GET List Semua Pemeriksaan
const getAllPemeriksaan = async (req, res) => {
    try {
        const data = await pemeriksaanService.getAllPemeriksaan();
        res.status(200).json({ message: 'Berhasil mengambil data pemeriksaan', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. POST Buat Catatan Pemeriksaan SOAP Baru (Validasi ditangani oleh Middleware)
const createPemeriksaan = async (req, res) => {
    try {
        const newPemeriksaan = await pemeriksaanService.createPemeriksaan(req.body);

        res.status(201).json({
            message: 'Catatan pemeriksaan berhasil disimpan.',
            data: newPemeriksaan
        });
    } catch (error) {
        // Asumsi error validasi id_pasien (404) ditangani oleh Service
        res.status(500).json({ message: 'Gagal menyimpan data pemeriksaan.', error: error.message });
    }
};

// 3. GET Detail Catatan SOAP
const getDetailPemeriksaan = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pemeriksaanService.getDetailPemeriksaan(id);
        if (!data) {
            return res.status(404).json({ message: 'Data pemeriksaan tidak ditemukan' });
        }
        res.status(200).json({ message: 'Detail catatan SOAP ditemukan', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. PUT Update Catatan SOAP (Validasi ditangani oleh Middleware)
const updatePemeriksaan = async (req, res) => {
    const { id } = req.params;
    try {
        const existingPemeriksaan = await pemeriksaanService.getDetailPemeriksaan(id);
        if (!existingPemeriksaan) {
            return res.status(404).json({ message: 'Data pemeriksaan tidak ditemukan' });
        }

        const updatedPemeriksaan = await pemeriksaanService.updatePemeriksaan(id, req.body);

        res.status(200).json({ message: 'Catatan SOAP berhasil diperbarui.', data: updatedPemeriksaan });
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