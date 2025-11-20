const express = require('express');
const router = express.Router();
const pemeriksaanController = require('../controllers/pemeriksaan.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { PemeriksaanSchema } = require('../validators/pemeriksaan.validator'); // Skema Pemeriksaan

router.use(verifyToken); 

router.get('/', pemeriksaanController.getAllPemeriksaan);
router.post('/', validator(PemeriksaanSchema), pemeriksaanController.createPemeriksaan); // <-- VALIDATOR
router.get('/:id', pemeriksaanController.getDetailPemeriksaan);
router.put('/:id', validator(PemeriksaanSchema), pemeriksaanController.updatePemeriksaan); // <-- VALIDATOR

module.exports = router;