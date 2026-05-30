// src/routes/medicalRecordRoutes.js
const express = require('express');
const router = express.Router();
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const {
    createMedicalRecord,
    getMedicalRecordsByPatient,
    getMedicalRecordById,
    updateMedicalRecord
} = require('../controllers/medicalRecordController');

// Tạo bệnh án — Doctor
router.post('/', xacThucToken, phanQuyen('doctor'), createMedicalRecord);

// Lấy tất cả bệnh án của bệnh nhân — Doctor + Patient + Admin
router.get('/patient/:patientId', xacThucToken, phanQuyen('doctor', 'patient', 'admin'), getMedicalRecordsByPatient);

// Xem chi tiết 1 bệnh án — Doctor + Patient + Admin
router.get('/:id', xacThucToken, phanQuyen('doctor', 'patient', 'admin'), getMedicalRecordById);

// Cập nhật bệnh án — Doctor
router.put('/:id', xacThucToken, phanQuyen('doctor'), updateMedicalRecord);

module.exports = router;
