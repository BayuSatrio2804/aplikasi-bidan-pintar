const express = require('express');
const router = express.Router();
// Lindungi semua route pasien
router.use(verifyToken); 

router.get('/', pasienController.getAllPasien);
router.post('/', pasienController.createPasien);
router.get('/:id', pasienController.getPasienById);
router.put('/:id', pasienController.updatePasien);
router.delete('/:id', pasienController.deletePasien);
router.get('/:id/riwayat', pasienController.getRiwayatPasien);

module.exports = router;