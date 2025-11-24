const db = require('../config/database');

const getUserById = async (id_user) => {
    const [rows] = await db.query('SELECT id_user, nama_lengkap, username, email FROM users WHERE id_user = ?', [id_user]);
    return rows[0];
};

const getUserByUsername = async (username) => {
    const [rows] = await db.query('SELECT id_user, username, password, nama_lengkap FROM users WHERE username = ?', [username]);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT id_user, username, password, nama_lengkap, email FROM users WHERE email = ?', [email]);
    return rows[0];
};

const updateProfile = async (id_user, data, hashedPassword = null) => {
    const { nama_lengkap, username, email } = data;
    let updateQuery = 'UPDATE users SET nama_lengkap = ?, username = ?, email = ?';
    const params = [nama_lengkap, username, email];

    if (hashedPassword) {
        updateQuery += ', password = ?';
        params.push(hashedPassword);
    }
    
    updateQuery += ' WHERE id_user = ?';
    params.push(id_user);
    
    await db.query(updateQuery, params);

    return { id_user, nama_lengkap, username, email };
};

module.exports = {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateProfile,
};