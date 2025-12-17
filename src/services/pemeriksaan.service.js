/**
 * Examination Service
 * Handles all medical examination (SOAP) database operations
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Get all examination records with optional filtering
 * @param {string} jenisLayanan - Filter by service type (optional)
 * @param {string} search - Search by patient name (optional)
 * @returns {Array} List of examinations
 */
const getAllPemeriksaan = async (jenisLayanan = null, search = null) => {
  console.log('🔍 Service getAllPemeriksaan called with:', { jenisLayanan, search });
  
  // Normalize empty strings to null
  jenisLayanan = jenisLayanan && jenisLayanan.trim() !== '' ? jenisLayanan.trim() : null;
  search = search && search.trim() !== '' ? search.trim() : null;
  
  console.log('🔍 After normalization:', { jenisLayanan, search });
  
  let query = `
    SELECT p.*, pas.nama AS nama_pasien
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    WHERE 1=1
  `;
  const params = [];

  // Filter by jenis_layanan if provided
  if (jenisLayanan) {
    query += ` AND p.jenis_layanan = ?`;
    params.push(jenisLayanan);
    console.log('  ➕ Added jenis_layanan filter:', jenisLayanan);
  }

  // Search by patient name if provided
  if (search) {
    query += ` AND pas.nama LIKE ?`;
    params.push(`%${search}%`);
    console.log('  ➕ Added search filter:', search);
  }

  query += ` ORDER BY p.tanggal_pemeriksaan DESC`;

  console.log('  📝 Final query params:', params);
  const [rows] = await db.query(query, params);
  console.log('  ✅ Query returned:', rows.length, 'rows');
  return rows;
};

/**
 * Get examination by ID
 * @param {string} id_pemeriksaan - Examination ID
 * @returns {Object|null} Examination details
 */
const getDetailPemeriksaan = async (id_pemeriksaan) => {
  const query = `
    SELECT p.*, pas.nama AS nama_pasien
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    WHERE p.id_pemeriksaan = ?
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);
  return rows[0] || null;
};

/**
 * Create new examination record (SOAP)
 * @param {Object} data - Examination data
 * @param {string} userId - User performing the action
 * @returns {Object} Created examination
 */
const createPemeriksaan = async (data, userId) => {
  const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = data;
  const id_pemeriksaan = uuidv4();

  const query = `
    INSERT INTO pemeriksaan 
    (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  await db.query(query, [id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana]);
  await auditService.recordDataLog(userId, 'CREATE', 'pemeriksaan', id_pemeriksaan);

  return { id_pemeriksaan, ...data };
};

/**
 * Update examination record
 * @param {string} id_pemeriksaan - Examination ID
 * @param {string} userId - User performing the action
 * @param {Object} data - Updated examination data
 * @returns {Object} Updated examination
 */
const updatePemeriksaan = async (id_pemeriksaan, userId, data) => {
  const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = data;

  const query = `
    UPDATE pemeriksaan 
    SET id_pasien = ?, jenis_layanan = ?, subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ?
    WHERE id_pemeriksaan = ?
  `;

  await db.query(query, [id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, id_pemeriksaan]);
  await auditService.recordDataLog(userId, 'UPDATE', 'pemeriksaan', id_pemeriksaan);

  return { id_pemeriksaan, ...data };
};

module.exports = {
  getAllPemeriksaan,
  getDetailPemeriksaan,
  createPemeriksaan,
  updatePemeriksaan
};