const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-key-12345'; 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ada atau format salah.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Simpan data user dari token (id, username) ke req.user
        req.user = decoded; 
        
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Akses ditolak. Token tidak valid.' });
    }
};

module.exports = { 
    verifyToken 
};