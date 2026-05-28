const express = require('express');
const router = express.Router();
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const { createDoctor, getDoctorById } = require('../controllers/doctorController');

// Tạo bác sĩ mới — chỉ Admin
router.post('/', xacThucToken, phanQuyen('admin'), createDoctor);

// Xem thông tin bác sĩ — Admin + Doctor
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor'), getDoctorById);

module.exports = router;
