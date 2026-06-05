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

<<<<<<< HEAD
// Tạo bệnh án — Doctor
router.post('/', xacThucToken, phanQuyen('doctor'), createMedicalRecord);

// ✅ PHẢI để trước /:id để không bị conflict
router.get('/my-record', xacThucToken, phanQuyen('patient'), getMyRecord);
router.put('/my-record', xacThucToken, phanQuyen('patient'), updateMyRecord);

// Lấy tất cả bệnh án của bệnh nhân — Doctor + Patient + Admin
router.get('/patient/:patientId', xacThucToken, phanQuyen('doctor', 'patient', 'admin'), getMedicalRecordsByPatient);

// Lấy bệnh án theo ID
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), getMedicalRecordById);
=======
// 1. Route tạo bệnh án mới (Giữ nguyên của bạn)
router.post('/', xacThucToken, phanQuyen('doctor'), medicalRecordController.createRecord);

// 2. Route lấy chi tiết một bệnh án (Giữ nguyên của bạn)
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), medicalRecordController.getRecordById);
>>>>>>> e7c95ccc407151f58352ceaa695cf480dcd46000

// 🔥 3. THÊM MỚI: Route cho Bác sĩ cập nhật chẩn đoán và đơn thuốc (openFDA) khi bấm nút Lưu
// Dùng phương thức PUT, chỉ cho phép 'doctor' truy cập
router.put('/:id', xacThucToken, phanQuyen('doctor'), medicalRecordController.updateRecordByDoctor);

// 🔥 4. THÊM MỚI: Route cho Bệnh nhân lấy toàn bộ lịch sử đơn thuốc đã khám của chính họ
// Phải đặt route cụ thể 'patient/my-records' lên TRÊN các route có truyền tham số động như '/:id' để tránh bị Express hiểu nhầm chữ 'patient' là một cái ':id'
router.get('/my/history', xacThucToken, phanQuyen('patient'), medicalRecordController.getPatientHistory);

module.exports = router;