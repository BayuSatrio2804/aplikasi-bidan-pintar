const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasien.controller');
const { verifyToken } = require('../middleware/auth');
const validator = require('../middleware/validator.middleware');
const { PasienSchema } = require('../validators/pasien.validator'); 

router.use(verifyToken); 

router.get('/', pasienController.getAllPasien); // FR-04
router.post('/', validator(PasienSchema), pasienController.createPasien); // FR-02, FR-06
router.get('/:id', pasienController.getPasienById);
router.put('/:id', validator(PasienSchema), pasienController.updatePasien); // FR-02, FR-06
router.delete('/:id', pasienController.deletePasien); // FR-02
router.get('/:id/riwayat', pasienController.getRiwayatPasien); // FR-08

module.exports = router;