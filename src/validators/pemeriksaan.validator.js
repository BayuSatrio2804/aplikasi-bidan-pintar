const Joi = require('joi');
const { VALID_LAYANAN } = require('../utils/constant'); // Menggunakan konstanta layanan umum

const PemeriksaanSchema = Joi.object({
    id_pasien: Joi.string().uuid().required(),
    jenis_layanan: Joi.string().valid(...VALID_LAYANAN).required(),
    subjektif: Joi.string().required().messages({'string.empty': 'Bagian Subjektif (S) wajib diisi.'}),
    objektif: Joi.string().required().messages({'string.empty': 'Bagian Objektif (O) wajib diisi.'}),
    analisa: Joi.string().required().messages({'string.empty': 'Bagian Analisa (A) wajib diisi.'}),
    tatalaksana: Joi.string().required().messages({'string.empty': 'Bagian Tatalaksana (P) wajib diisi.'}),
});

module.exports = {
    PemeriksaanSchema
};