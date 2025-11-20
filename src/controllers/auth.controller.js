const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/auth.service'); // Import Service

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-key-12345';
const SALT_ROUNDS = 10;

// --- Register ---
const register = async (req, res) => {
    const { nama_lengkap, username, email, password } = req.body;
    // Validasi input ditangani oleh validator middleware

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

// --- Login ---
const login = async (req, res) => {
    const { identifier, password } = req.body; // Menerima identifier (username/email)

    try {
        // Cari user berdasarkan username atau email
        const userByUsername = await authService.getUserByUsername(identifier);
        const userByEmail = await authService.getUserByEmail(identifier);
        
        const user = userByUsername || userByEmail;

        if (!user) {
            return res.status(401).json({ message: 'Username/Email atau password salah.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Username/Email atau password salah.' });
        }

        const token = jwt.sign(
            { id: user.id_user, username: user.username }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login berhasil',
            token: token,
            user: { id_user: user.id_user, nama_lengkap: user.nama_lengkap, username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- Get Profile (GET /v1/auth/me) ---
const getProfile = async (req, res) => {
    const userId = req.user.id; 

    try {
        // Panggil Service
        const user = await authService.getUserById(userId); 

        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.status(200).json({ message: 'Profil berhasil diambil', data: user });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- Update Profile (PUT /v1/auth/me) ---
const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { password } = req.body; 

    let hashedPassword = null;

    try {
        if (password) {
            hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        }
        
        // Panggil Service
        const updatedData = await authService.updateProfile(userId, req.body, hashedPassword);

        res.status(200).json({ message: 'Profil berhasil diperbarui', data: updatedData });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username atau Email sudah digunakan.' });
        }
        res.status(500).json({ message: 'Gagal update profil', error: error.message });
    }
};


module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};