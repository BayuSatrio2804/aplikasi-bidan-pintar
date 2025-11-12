// middleware/auth.js

// Dalam aplikasi nyata, Anda akan memverifikasi JWT (JSON Web Token) di sini.
const mockAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Sesuai (Contoh 401 Unauthorized)
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ada atau format salah.' });
  }

  // const token = authHeader.split(' ')[1];
  // ... (logika verifikasi token) ...
  
  console.log('Mock Auth: Akses diberikan.');
  // Anggap token valid, lanjutkan ke controller
  next(); 
};

module.exports = { mockAuth };