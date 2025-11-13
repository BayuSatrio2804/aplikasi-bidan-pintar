// middleware/auth.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'ganti-dengan-secret-key-yang-kuat'; 

// Middleware Verifikasi JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ada atau format salah.' });
    }

    // Ambil token dari header (hilangkan 'Bearer ')
    const token = authHeader.split(' ')[1];

    try {
        // Verifikasi Token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Simpan data user dari token ke objek request
        req.user = decoded;
        
        // Lanjutkan ke controller
        next(); 
    } catch (error) {
        // Token tidak valid (expired/salah signature)
        return res.status(403).json({ message: 'Akses ditolak. Token tidak valid.' });
    }
};

module.exports = { 
    verifyToken 
};