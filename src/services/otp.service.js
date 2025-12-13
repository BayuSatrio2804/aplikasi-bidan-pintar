// src/services/otp.service.js
const db = require('../config/database'); // Asumsi koneksi database ada di sini
const mailer = require('../utils/mailer');
const { OTP_EXPIRY_MINUTES } = require('../utils/constant'); 
const crypto = require('crypto');

/**
 * Menghasilkan kode OTP 6 digit acak.
 */
const generateOTPCode = () => {
    const min = 100000;
    const max = 999999;
    return crypto.randomInt(min, max + 1).toString();
};

/**
 * Menyimpan/memperbarui kode OTP di DB dan mengirimkan email.
 */
const saveAndSendOTP = async (id_user, email) => {
    const otpCode = generateOTPCode();
    // Hitung waktu kedaluwarsa
    const expiryTime = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000); 

    try {
        const query = `
            INSERT INTO otp_codes (id_user, otp_code, expires_at) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            otp_code = VALUES(otp_code), 
            expires_at = VALUES(expires_at),
            created_at = CURRENT_TIMESTAMP
        `;
        await db.query(query, [id_user, otpCode, expiryTime]); 

        await mailer.sendOTP(email, otpCode);

        return true;
        
    } catch (error) {
        console.error('Error in saveAndSendOTP:', error);
        throw new Error('Gagal memproses dan mengirimkan OTP.');
    }
};

/**
 * Memvalidasi kode OTP yang diinput pengguna.
 */
const validateOTP = async (user, otp_code) => {
    // 1. Ambil data OTP dari DB
    const [rows] = await db.query('SELECT otp_code, expires_at FROM otp_codes WHERE id_user = ?', [user.id_user]);
    const otpData = rows[0];

    if (!otpData) {
        throw new Error('Kode OTP tidak ditemukan. Silakan login ulang untuk mendapatkan kode baru.');
    }

    // 2. Cek KEDALUWARSA
    const isExpired = new Date() > new Date(otpData.expires_at);
    if (isExpired) {
        await db.query('DELETE FROM otp_codes WHERE id_user = ?', [user.id_user]); 
        throw new Error('Kode OTP sudah kedaluwarsa. Silakan kirim ulang.');
    }

    // 3. Cek Kesamaan Kode
    if (otpData.otp_code !== otp_code) {
        throw new Error('Kode OTP salah.');
    }

    // 4. Verifikasi Berhasil: Hapus OTP dari DB
    await db.query('DELETE FROM otp_codes WHERE id_user = ?', [user.id_user]);
    
    return true; 
};

const deleteOTP = async (id_user) => {
    try {
        await db.query('DELETE FROM otp_codes WHERE id_user = ?', [id_user]);
    } catch (error) {
        console.error('Gagal menghapus OTP:', error);
        // Lanjutkan proses meskipun gagal hapus OTP
    }
};

module.exports = {
    saveAndSendOTP,
    validateOTP,
    deleteOTP
};