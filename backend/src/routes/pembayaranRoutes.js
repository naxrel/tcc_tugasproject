const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/pembayaranController');

router.use(protect);

// POST /api/v1/pembayaran      — Buat pembayaran
router.post('/', ctrl.create);

// GET  /api/v1/pembayaran/:id  — Detail pembayaran
router.get('/:id', ctrl.getOne);

module.exports = router;
