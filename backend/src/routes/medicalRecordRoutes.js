// src/routes/medicalRecordRoutes.js
const express = require('express');
const router = express.Router();
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const {
    createMedicalRecord,
    getMedicalRecordsByPatient,
    getMedicalRecordById,
    updateMedicalRecord,
    getMyRecord,
    updateMyRecord,
} = require('../controllers/medicalRecordController');

// Tạo bệnh án — Doctor
router.post('/', xacThucToken, phanQuyen('doctor'), createMedicalRecord);

// ✅ PHẢI để trước /:id để không bị conflict
router.get('/my-record', xacThucToken, phanQuyen('patient'), getMyRecord);
router.put('/my-record', xacThucToken, phanQuyen('patient'), updateMyRecord);

// Lấy tất cả bệnh án của bệnh nhân — Doctor + Patient + Admin
router.get('/patient/:patientId', xacThucToken, phanQuyen('doctor', 'patient', 'admin'), getMedicalRecordsByPatient);

// Lấy bệnh án theo ID
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), getMedicalRecordById);

module.exports = router;