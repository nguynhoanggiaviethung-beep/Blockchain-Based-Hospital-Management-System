// API Format/src/routes/medicalRecordRoutes.js
const express = require('express');
const router = express.Router();

const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const medicalRecordController = require('../controllers/medicalRecordController'); // Import nguyên Object

// Dòng 9: Gọi thông qua Object tổng
router.post('/', xacThucToken, phanQuyen('doctor'), medicalRecordController.createRecord);

// Các dòng dưới cũng gọi tương tự
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), medicalRecordController.getRecordById);

module.exports = router;