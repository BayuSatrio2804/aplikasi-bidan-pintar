const db = require('../config/database');
const ExcelJS = require('exceljs');

// --- Fungsi Helper 1: Mengambil Data DETIL untuk Laporan ---
const getLaporanData = async (bulan, tahun) => {
    const query = `
        SELECT 
            p.nama AS nama_pasien,                 
            r.tanggal_pemeriksaan AS tanggal,      
            r.jenis_layanan,
            r.subjektif,                          
            r.objektif,                           
            r.analisa,                             
            r.tatalaksana                          
        FROM pemeriksaan r
        JOIN pasien p ON r.id_pasien = p.id_pasien
        WHERE MONTH(r.tanggal_pemeriksaan) = ? AND YEAR(r.tanggal_pemeriksaan) = ?
        ORDER BY r.tanggal_pemeriksaan ASC
    `;
    const [rows] = await db.query(query, [bulan, tahun]);
    return rows;
};

// --- Fungsi Helper 2: Mencatat Log Laporan ---
const recordLaporanLog = async (id_user, bulan, tahun, format) => {
    const id_pasien = null; 
    const jenis_layanan = 'BULANAN_DETIL'; 
    const query = `
        INSERT INTO laporan_log 
        (id_pasien, jenis_layanan, periode_bulan, periode_tahun, format_file, keterangan) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const keterangan = `Laporan Detil Excel Dibuat oleh Bidan ID: ${id_user}`;
    
    // Asumsi: id_user tidak disimpan, hanya di keterangan (sesuai skema laporan_log Anda)
    await db.query(query, [id_pasien, jenis_layanan, bulan, tahun, format, keterangan]);
};


// --- Fungsi Utama: Generate Laporan Bulanan (Excel) ---
const generateLaporanBulanan = async (req, res) => {
    const { format, bulan, tahun } = req.query;
    const id_user_bidan = req.user ? req.user.id : 'SIMULASI_USER_ID'; 

    const bulanInt = parseInt(bulan);
    const tahunInt = parseInt(tahun);

    // Validasi
    if (!format || format.toLowerCase() !== 'excel' || isNaN(bulanInt) || bulanInt < 1 || bulanInt > 12 || isNaN(tahunInt) || tahunInt < 2020) {
        return res.status(400).json({ 
            message: 'Input tidak valid. Pastikan format="excel", bulan (1-12), dan tahun terisi dengan benar.' 
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

        // [LANGKAH 2]: Catat log
        await recordLaporanLog(id_user_bidan, bulanInt, tahunInt, format.toLowerCase());
        
        // [LANGKAH 3]: Pembuatan dan Pengiriman File Excel NYATA
        const filename = `Laporan_Detil_Bulan_${bulanInt}_${tahunInt}.xlsx`;
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Laporan Detil ${bulanInt}-${tahunInt}`);

        // Definisikan Kolom Header
        worksheet.columns = [
            { header: 'No.', key: 'no', width: 5 },
            { header: 'Nama Pasien', key: 'nama_pasien', width: 25 },
            { header: 'Tanggal Periksa', key: 'tanggal', width: 15 },
            { header: 'Jenis Layanan', key: 'jenis_layanan', width: 15 },
            { header: 'SOAP (S: Subjektif)', key: 'subjektif', width: 40 },
            { header: 'SOAP (O: Objektif)', key: 'objektif', width: 40 },
            { header: 'SOAP (A: Analisa)', key: 'analisa', width: 40 },
            { header: 'SOAP (P: Tatalaksana)', key: 'tatalaksana', width: 40 },
        ];

        // Masukkan Data Baris
        reportData.forEach((data, index) => {
            worksheet.addRow({
                no: index + 1,
                nama_pasien: data.nama_pasien,
                tanggal: new Date(data.tanggal).toLocaleDateString('id-ID'),
                jenis_layanan: data.jenis_layanan,
                subjektif: data.subjektif,
                objektif: data.objektif,
                analisa: data.analisa,
                tatalaksana: data.tatalaksana,
            });
        });

        // Atur Header HTTP dan Kirim
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Gagal membuat laporan.', error: error.message });
    }
};

module.exports = {
    generateLaporanBulanan
};