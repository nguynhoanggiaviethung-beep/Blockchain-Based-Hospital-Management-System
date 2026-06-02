// API Format/src/routes/medicalRecordRoutes.js
const express = require('express');
const router = express.Router();

const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const medicalRecordController = require('../controllers/medicalRecordController'); // Import nguyên Object

// 1. Route tạo bệnh án mới (Giữ nguyên của bạn)
router.post('/', xacThucToken, phanQuyen('doctor'), medicalRecordController.createRecord);

// 2. Route lấy chi tiết một bệnh án (Giữ nguyên của bạn)
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), medicalRecordController.getRecordById);

// 🔥 3. THÊM MỚI: Route cho Bác sĩ cập nhật chẩn đoán và đơn thuốc (openFDA) khi bấm nút Lưu
// Dùng phương thức PUT, chỉ cho phép 'doctor' truy cập
router.put('/:id', xacThucToken, phanQuyen('doctor'), medicalRecordController.updateRecordByDoctor);

// 🔥 4. THÊM MỚI: Route cho Bệnh nhân lấy toàn bộ lịch sử đơn thuốc đã khám của chính họ
// Phải đặt route cụ thể 'patient/my-records' lên TRÊN các route có truyền tham số động như '/:id' để tránh bị Express hiểu nhầm chữ 'patient' là một cái ':id'
router.get('/my/history', xacThucToken, phanQuyen('patient'), medicalRecordController.getPatientHistory);

module.exports = router;