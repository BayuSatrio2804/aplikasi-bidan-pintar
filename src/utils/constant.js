const VALID_LAYANAN = ["ANC", "KB", "Imunisasi", "Persalinan", "Nifas"];
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-key-12345';
const SALT_ROUNDS = 10;

module.exports = {
    VALID_LAYANAN,
    JWT_SECRET,
    SALT_ROUNDS,
};