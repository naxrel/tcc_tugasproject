const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/pelangganController');

router.use(protect);

// GET  /api/v1/pelanggan/:id  — Lihat profil
router.get('/:id', ctrl.getProfile);

// PUT  /api/v1/pelanggan/:id  — Update profil
router.put('/:id', ctrl.updateProfile);

module.exports = router;
