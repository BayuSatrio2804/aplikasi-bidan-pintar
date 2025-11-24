const validator = (schema) => (req, res, next) => {
    // Jalankan validasi, mengumpulkan semua error (abortEarly: false)
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        // Format error agar sesuai dengan API Spec (HTTP 400 Bad Request)
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