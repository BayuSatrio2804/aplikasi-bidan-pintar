const Joi = require('joi');

const RegisterSchema = Joi.object({
    nama_lengkap: Joi.string().required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const LoginSchema = Joi.object({
    identifier: Joi.string().required().description('Bisa berupa username atau email'),
    password: Joi.string().required(),
});

const UpdateProfileSchema = Joi.object({
    // Semua optional karena tujuannya hanya memperbarui sebagian data
    nama_lengkap: Joi.string().optional(),
    username: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(), 
});

module.exports = {
    RegisterSchema,
    LoginSchema,
    UpdateProfileSchema,
};