const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasien.controller');
const { verifyToken } = require('../middleware/auth');
const validator = require('../middleware/validator.middleware');
const { PasienSchema } = require('../validators/pasien.validator'); // Skema Pasien

router.use(verifyToken); 

router.get('/', pasienController.getAllPasien);
router.post('/', validator(PasienSchema), pasienController.createPasien); // <-- VALIDATOR
router.get('/:id', pasienController.getPasienById);
router.put('/:id', validator(PasienSchema), pasienController.updatePasien); // <-- VALIDATOR
router.delete('/:id', pasienController.deletePasien);
router.get('/:id/riwayat', pasienController.getRiwayatPasien);

module.exports = router;