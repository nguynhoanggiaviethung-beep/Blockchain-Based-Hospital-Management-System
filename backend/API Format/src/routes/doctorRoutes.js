// API Format/src/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();

// 1. Import bộ gác cổng và xử lý
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const doctorController = require('../controllers/doctorController');

// 2. Định nghĩa API theo tư duy Nodemy
// Tạo bác sĩ mới: BẮT BUỘC phải đăng nhập VÀ phải là 'admin'
router.post('/', xacThucToken, phanQuyen('admin'), doctorController.createDoctor);

// Xem thông tin bác sĩ: BẮT BUỘC đăng nhập VÀ role phải là 'admin' HOẶC 'doctor'
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor'), doctorController.getDoctorById);

module.exports = router;