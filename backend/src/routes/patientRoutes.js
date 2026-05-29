// src/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');

// Tạo bệnh nhân mới — chỉ Admin
router.post('/', xacThucToken, phanQuyen('admin'), createPatient);

// Lấy danh sách bệnh nhân — Admin + Doctor
// Hỗ trợ search: GET /api/v1/patients?search=Nguyen
router.get('/', xacThucToken, phanQuyen('admin', 'doctor'), getAllPatients);

// Lấy 1 bệnh nhân theo ID — Admin + Doctor + Patient
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), getPatientById);

// Cập nhật bệnh nhân — chỉ Admin
router.put('/:id', xacThucToken, phanQuyen('admin'), updatePatient);

// Xóa bệnh nhân — chỉ Admin
router.delete('/:id', xacThucToken, phanQuyen('admin'), deletePatient);

module.exports = router;