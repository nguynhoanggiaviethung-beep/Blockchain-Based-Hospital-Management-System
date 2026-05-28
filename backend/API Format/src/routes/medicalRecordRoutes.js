const express = require('express');
const router = express.Router();
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const { createMedicalRecord, updateMedicalRecord } = require('../controllers/medicalRecordController');

// Tạo hồ sơ bệnh án — chỉ Doctor
router.post('/', xacThucToken, phanQuyen('doctor'), createMedicalRecord);

// Cập nhật hồ sơ bệnh án — chỉ Doctor
router.put('/:id', xacThucToken, phanQuyen('doctor'), updateMedicalRecord);

module.exports = router;
