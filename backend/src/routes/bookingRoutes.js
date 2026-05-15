const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/bookingController');

router.use(protect);

// POST   /api/v1/booking          — Buat booking baru
router.post('/', ctrl.create);

// GET    /api/v1/booking          — List semua booking
router.get('/', ctrl.list);

// GET    /api/v1/booking/:id      — Detail booking
router.get('/:id', ctrl.getOne);

// PUT    /api/v1/booking/:id/status — Update status booking
router.put('/:id/status', ctrl.updateStatus);

// DELETE /api/v1/booking/:id      — Batalkan booking
router.delete('/:id', ctrl.cancel);

module.exports = router;
