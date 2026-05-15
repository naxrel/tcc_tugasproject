const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/layananController');

// GET /api/v1/layanan  — List semua layanan (public)
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

// POST /api/v1/layanan — Tambah layanan (admin)
router.post('/', protect, ctrl.create);

// PUT /api/v1/layanan/:id — Update layanan (admin)
router.put('/:id', protect, ctrl.update);

// DELETE /api/v1/layanan/:id — Hapus layanan (admin)
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
