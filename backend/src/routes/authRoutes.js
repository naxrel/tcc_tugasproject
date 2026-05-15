const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

// POST /api/v1/auth/register
router.post('/register', ctrl.register);

// POST /api/v1/auth/login
router.post('/login', ctrl.login);

// POST /api/v1/auth/admin/login
router.post('/admin/login', ctrl.loginAdmin);

// POST /api/v1/auth/logout
router.post('/logout', ctrl.logout);

module.exports = router;
