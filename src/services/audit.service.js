// src/services/audit.service.js
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const recordLoginAttempt = async (userId, username, status, ipAddress) => {
    try {
        const id_audit = uuidv4();
        const query = `
            INSERT INTO audit_logs (id_audit, id_user, username, status, ip_address, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        await db.query(query, [id_audit, userId, username, status, ipAddress]);
    } catch (error) {
        console.error('Error recording login attempt:', error);
        // Jangan throw error agar login tetap berjalan meskipun audit logging gagal
    }
};

module.exports = { recordLoginAttempt };
