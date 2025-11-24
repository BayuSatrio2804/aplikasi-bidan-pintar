const express = require('express');
const router = express.Router();
const pemeriksaanController = require('../controllers/pemeriksaan.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { PemeriksaanSchema } = require('../validators/pemeriksaan.validator'); 

router.use(verifyToken); 

router.get('/', pemeriksaanController.getAllPemeriksaan);
router.post('/', validator(PemeriksaanSchema), pemeriksaanController.createPemeriksaan); // FR-03, FR-06
router.get('/:id', pemeriksaanController.getDetailPemeriksaan);
router.put('/:id', validator(PemeriksaanSchema), pemeriksaanController.updatePemeriksaan); // FR-03, FR-06

module.exports = router;