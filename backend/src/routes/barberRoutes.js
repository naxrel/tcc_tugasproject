const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/barberController');

// GET  /api/v1/barber        — List semua barber (public)
router.get('/', ctrl.list);

// Protected (admin only)
router.use(protect);

// POST   /api/v1/barber      — Tambah barber
router.post('/', ctrl.create);

// PUT    /api/v1/barber/:id  — Update barber
router.put('/:id', ctrl.update);

// DELETE /api/v1/barber/:id  — Hapus barber
router.delete('/:id', ctrl.remove);

module.exports = router;
