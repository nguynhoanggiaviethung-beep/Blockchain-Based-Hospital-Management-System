// API Format/src/routes/patientRoutes.js
const express = require('express');
const router = express.Router();

const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const patientController = require('../controllers/patientController'); // Import dạng Object

// Dòng 9: Đảm bảo gọi qua patientController.getAllPatients
router.get('/', xacThucToken, phanQuyen('admin', 'doctor'), patientController.getAllPatients);

// Dòng tiếp theo: Gọi qua patientController.getPatientById
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), patientController.getPatientById);

module.exports = router;