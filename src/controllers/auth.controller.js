// controllers/auth.controller.js

const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Ambil secret key dari .env (Pastikan sudah ada JWT_SECRET di file .env Anda)
const JWT_SECRET = process.env.JWT_SECRET || 'ganti-dengan-secret-key-yang-kuat';
const SALT_ROUNDS = 10;

// --- 1. POST /v1/auth/register (FR-01) ---
const register = async (req, res) => {
    const { nama_lengkap, username, email, password } = req.body;
    if (!nama_lengkap || !username || !email || !password) {
        return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const id_user = uuidv4();

        const query = `
            INSERT INTO users (id_user, nama_lengkap, username, email, password) 
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(query, [id_user, nama_lengkap, username, email, hashedPassword]);

        res.status(201).json({ 
            message: 'Registrasi berhasil',
            data: { id_user, nama_lengkap, username, email }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const message = error.sqlMessage.includes('username') 
                ? 'Username sudah digunakan.' 
                : 'Email sudah terdaftar.';
            return res.status(400).json({ message });
        }
        res.status(500).json({ message: 'Gagal melakukan registrasi', error: error.message });
    }
};

// --- 2. POST /v1/auth/login ---
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan Password wajib diisi.' });
    }

    try {
        // Cari User
        const [rows] = await db.query('SELECT id_user, username, password, nama_lengkap FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Username atau password salah.' });
        }

        // Verifikasi Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Username atau password salah.' });
        }

        // Buat JWT
        const token = jwt.sign(
            { id: user.id_user, username: user.username }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login berhasil',
            token: token,
            user: {
                id_user: user.id_user,
                nama_lengkap: user.nama_lengkap
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    register,
    login,
};