// src/routes/patientRoutes.js
// Chức năng: Định nghĩa các đường dẫn API cho bệnh nhân
// Middleware kiểm tra token và phân quyền trước khi vào controller

const express = require('express');
const router = express.Router();

// Import middleware xác thực và phân quyền
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');

// Import các hàm xử lý từ controller
const { createPatient, getPatientById } = require('../controllers/patientController');

// ==========================================
// POST /api/v1/patients
// Tạo bệnh nhân mới — chỉ Admin mới được tạo
// ==========================================
router.post('/', xacThucToken, phanQuyen('admin'), createPatient);

// ==========================================
// GET /api/v1/patients/:id
// Xem thông tin bệnh nhân — Admin, Doctor, Patient đều xem được
// ==========================================
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), getPatientById);

module.exports = router;
