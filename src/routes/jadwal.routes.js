const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwal.controller');
const { verifyToken } = require('../middleware/auth'); 

// Lindungi semua route jadwal
router.use(verifyToken); 

router.get('/', jadwalController.listJadwal);
router.post('/', jadwalController.createJadwal);
router.get('/:id', jadwalController.getDetailJadwal);
router.put('/:id', jadwalController.updateJadwal);
router.delete('/:id', jadwalController.deleteJadwal);

module.exports = router;