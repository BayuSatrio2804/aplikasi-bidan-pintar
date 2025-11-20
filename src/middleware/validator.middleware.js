const validator = (schema) => (req, res, next) => {
    // Validasi req.body menggunakan skema Joi yang diberikan
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorMessages = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));

        return res.status(400).json({
            message: 'Validasi input gagal',
            errors: errorMessages
        });
    }
    next();
};

module.exports = validator;