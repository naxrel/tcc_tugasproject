const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/antreanController');

router.use(protect);

// GET /api/v1/antrean                     — Lihat antrean realtime
router.get('/', ctrl.list);

// GET /api/v1/antrean/:booking_id         — Estimasi giliran pelanggan
router.get('/:booking_id', ctrl.getEstimasi);

module.exports = router;
