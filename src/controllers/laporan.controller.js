// src/controllers/laporan.controller.js

const db = require('../config/database');

// --- Fungsi Helper 1: Mengambil Data DETIL untuk Laporan ---
const getLaporanData = async (bulan, tahun) => {
    // Mengambil data per baris: Nama Pasien, Tanggal, dan semua bagian SOAP.
    
    const query = `
        SELECT 
            p.nama AS nama_pasien,                 -- NAMA PASIEN
            r.tanggal_pemeriksaan AS tanggal,      -- TANGGAL
            r.jenis_layanan,
            r.subjektif,                           -- SOAP (S)
            r.objektif,                            -- SOAP (O)
            r.analisa,                             -- SOAP (A)
            r.tatalaksana                          -- SOAP (P)
        FROM pemeriksaan r
        JOIN pasien p ON r.id_pasien = p.id_pasien
        WHERE MONTH(r.tanggal_pemeriksaan) = ? AND YEAR(r.tanggal_pemeriksaan) = ?
        ORDER BY r.tanggal_pemeriksaan ASC
    `;
    const [rows] = await db.query(query, [bulan, tahun]);
    return rows;
};

// --- Fungsi Helper 2: Mencatat Log Laporan (Ke Tabel laporan_log) ---
const recordLaporanLog = async (id_user, bulan, tahun, format) => {
    // Asumsi: id_user adalah ID Bidan yang diambil dari req.user.id
    // Tabel laporan_log tidak memiliki kolom id_user, jadi kita simpan di keterangan.
    const id_pasien = null; 
    const jenis_layanan = 'BULANAN_DETIL'; 

    const query = `
        INSERT INTO laporan_log 
        (id_pasien, jenis_layanan, periode_bulan, periode_tahun, format_file, keterangan) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const keterangan = `Laporan Detil Excel Dibuat oleh Bidan ID: ${id_user}`;
    
    await db.query(query, [id_pasien, jenis_layanan, bulan, tahun, format, keterangan]);
};


// --- Fungsi Utama: Generate Laporan Bulanan (Excel Only) ---
const generateLaporanBulanan = async (req, res) => {
    const { format, bulan, tahun } = req.query;
    
    // Dapatkan ID Bidan dari JWT payload (asumsi dijamin ada oleh verifyToken)
    const id_user_bidan = req.user ? req.user.id : 'SIMULASI_USER_ID'; 

    // ==========================================================
    // VALIDASI INPUT (FR-05 & Excel Only)
    // ==========================================================
    const bulanInt = parseInt(bulan);
    const tahunInt = parseInt(tahun);

    if (!format || !bulan || !tahun) {
        return res.status(400).json({ 
            message: 'Parameter wajib (format, bulan, tahun) tidak lengkap.' 
        });
    }

    if (format.toLowerCase() !== 'excel') {
        return res.status(400).json({ 
            message: 'Format laporan hanya mendukung "excel".' 
        });
    }
    
    if (isNaN(bulanInt) || bulanInt < 1 || bulanInt > 12 || isNaN(tahunInt) || tahunInt < 2020) {
        return res.status(400).json({ 
            message: 'Bulan harus antara 1-12 dan Tahun harus berupa angka valid (misalnya > 2020).' 
        });
    }

    try {
        // [LANGKAH 1]: Ambil data detil per kunjungan
        const reportData = await getLaporanData(bulanInt, tahunInt);

        if (reportData.length === 0) {
            return res.status(200).json({
                message: `Tidak ada data pemeriksaan detil untuk periode ${bulanInt}/${tahunInt}.`,
                data: []
            });
        }

        // [LANGKAH 2]: Catat log sebelum mengirim file
        await recordLaporanLog(id_user_bidan, bulanInt, tahunInt, format.toLowerCase());
        
        // [LANGKAH 3]: Pembuatan dan Pengiriman File Excel (SIMULASI)
        const filename = `Laporan_Detil_Bulan_${bulanInt}_${tahunInt}.xlsx`;
        
        // Atur header untuk pengiriman file Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // SIMULASI: Mengirim data detil sebagai JSON
        return res.status(200).json({
            message: `Simulasi berhasil: File Excel siap diunduh (Log dicatat untuk Bidan ID: ${id_user_bidan}).`,
            periode: `${bulanInt}/${tahunInt}`,
            total_data_kunjungan: reportData.length,
            detil_kunjungan: reportData
        });
        
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Gagal membuat laporan.', error: error.message });
    }
};

module.exports = {
    generateLaporanBulanan
};