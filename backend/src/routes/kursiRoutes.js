const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/kursiController');

// GET /api/v1/kursi  — List semua kursi + status (public)
router.get('/', ctrl.list);

// Protected (admin only)
router.use(protect);

// PUT /api/v1/kursi/:id/status  — Update status kursi
router.put('/:id/status', ctrl.updateStatus);

module.exports = router;
