const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/notifikasiController');

router.use(protect);

// GET /api/v1/notifikasi/:pelanggan_id  — Lihat notifikasi
router.get('/:pelanggan_id', ctrl.list);

// PUT /api/v1/notifikasi/:id/baca       — Tandai sudah dibaca
router.put('/:id/baca', ctrl.markRead);

module.exports = router;
