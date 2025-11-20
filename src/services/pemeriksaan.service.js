const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// --- Service 1: Membuat Pemeriksaan Baru ---
const createPemeriksaan = async (data) => {
    const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = data;
    const id_pemeriksaan = uuidv4();
    
    const query = `
        INSERT INTO pemeriksaan 
        (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await db.query(query, [id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana]);

    return { id_pemeriksaan, ...data };
};

// --- Service 2: Mengambil Detail Pemeriksaan ---
const getDetailPemeriksaan = async (id_pemeriksaan) => {
    const [rows] = await db.query('SELECT * FROM pemeriksaan WHERE id_pemeriksaan = ?', [id_pemeriksaan]);
    return rows[0];
};

// --- Service 3: Mengambil Semua Pemeriksaan (Opsional/Admin) ---
const getAllPemeriksaan = async () => {
    const [rows] = await db.query('SELECT * FROM pemeriksaan ORDER BY tanggal_pemeriksaan DESC');
    return rows;
};

// --- Service 4: Memperbarui Pemeriksaan ---
const updatePemeriksaan = async (id_pemeriksaan, data) => {
    const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = data;
    
    const query = `
        UPDATE pemeriksaan SET 
        id_pasien = ?, jenis_layanan = ?, subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ? 
        WHERE id_pemeriksaan = ?
    `;
    
    await db.query(query, [id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, id_pemeriksaan]);
    
    return { id_pemeriksaan, ...data };
};


// --- EXPORT SEMUA FUNGSI ---
module.exports = {
    createPemeriksaan,
    getDetailPemeriksaan,
    getAllPemeriksaan,
    updatePemeriksaan,
};