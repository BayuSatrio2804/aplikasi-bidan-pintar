const express = require('express');
const router = express.Router();
const pemeriksaanController = require('../controllers/pemeriksaan.controller');
const { verifyToken } = require('../middleware/auth'); 

// Lindungi semua route pemeriksaan
router.use(verifyToken); 

router.get('/', pemeriksaanController.getAllPemeriksaan);
router.post('/', pemeriksaanController.createPemeriksaan);
router.get('/:id', pemeriksaanController.getDetailPemeriksaan);
router.put('/:id', pemeriksaanController.updatePemeriksaan);

module.exports = router;