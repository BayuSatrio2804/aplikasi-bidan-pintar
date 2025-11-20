const db = require('../config/database');
const LAYANAN_DIPANTAU = ['ANC', 'Persalinan', 'Nifas', 'KB', 'Imunisasi'];

const getRekapLayanan = async (req, res) => {
    const { tahun } = req.query; 

    try {
        let params = [];
        
        let query = `
            SELECT 
                jenis_layanan,
                COUNT(id_pasien) as jumlah_kunjungan
            FROM pemeriksaan
            WHERE jenis_layanan IN (?)
        `;
        params.push(LAYANAN_DIPANTAU);

        if (tahun) {
            query += ' AND YEAR(tanggal_pemeriksaan) = ?';
            params.push(tahun);
        }

        query += ' GROUP BY jenis_layanan';
        
        const [rows] = await db.query(query, params);

        let totalKunjungan = 0;
        rows.forEach(row => {
            totalKunjungan += row.jumlah_kunjungan;
        });

        const rekapData = rows.map(row => {
            const persentase = (row.jumlah_kunjungan / totalKunjungan) * 100;
            return {
                layanan: row.jenis_layanan,
                jumlah_pasien: row.jumlah_kunjungan,
                persentase: parseFloat(persentase.toFixed(2))
            };
        });

        res.status(200).json({
            message: 'Data rekap pasien per kategori layanan berhasil diambil',
            total: totalKunjungan,
            data: rekapData
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Gagal mengambil data dashboard.', error: error.message });
    }
};

module.exports = {
    getRekapLayanan
};