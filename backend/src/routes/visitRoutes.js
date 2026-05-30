// src/routes/visitRoutes.js
const express = require('express');
const router = express.Router();
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const {
    createVisit,
    getVisitsByPatient,
    getVisitById,
    updateVisit
} = require('../controllers/visitController');

// Tạo lượt khám mới — Doctor
router.post('/', xacThucToken, phanQuyen('doctor'), createVisit);

// Lấy lịch sử khám theo bệnh nhân — Doctor + Patient + Admin
router.get('/patient/:patientId', xacThucToken, phanQuyen('doctor', 'patient', 'admin'), getVisitsByPatient);

// Xem chi tiết 1 lượt khám — Doctor + Patient + Admin
router.get('/:id', xacThucToken, phanQuyen('doctor', 'patient', 'admin'), getVisitById);

// Cập nhật lượt khám — Doctor
router.put('/:id', xacThucToken, phanQuyen('doctor'), updateVisit);

module.exports = router;
