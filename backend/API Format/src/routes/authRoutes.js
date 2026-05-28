// src/routes/authRoutes.js
// Chức năng: Định nghĩa các đường dẫn (URL) cho Auth

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/v1/auth/register → Gọi hàm register
router.post('/register', register);

// POST /api/v1/auth/login → Gọi hàm login
router.post('/login', login);

module.exports = router;
