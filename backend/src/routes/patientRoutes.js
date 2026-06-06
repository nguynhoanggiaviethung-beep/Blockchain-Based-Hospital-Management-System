// src/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    capNhatHoSoSucKhoe,       // Hàm dành cho Bệnh nhân tự nhập chỉ số sức khỏe cá nhân
    capNhatKhamBenhChuyenMon  // Hàm mới (bạn sẽ thêm vào Controller) dành cho Bác sĩ kết luận
} = require('../controllers/patientController');

// [POST] Tạo bệnh nhân mới — admin + doctor + patient
router.post('/', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), createPatient);

// [GET] Lấy danh sách bệnh nhân — Admin + Doctor
router.get('/', xacThucToken, phanQuyen('admin', 'doctor'), getAllPatients);


// --------------------------------------------------------------------------
// 🩺 LUỒNG 1: THÔNG TIN SỨC KHỎE CÁ NHÂN (Chiều cao, cân nặng, dị ứng...)
// Bệnh nhân tự quản lý hoặc Admin nhập hộ. Bác sĩ chỉ xem (thông qua lệnh GET /:id) chứ không sửa ở đây.
// --------------------------------------------------------------------------
router.put('/:id/health-profile', xacThucToken, phanQuyen('patient', 'admin'), capNhatHoSoSucKhoe);


// --------------------------------------------------------------------------
// 🩺 LUỒNG 2: HỒ SƠ KHÁM BỆNH CHUYÊN MÔN (Kết luận của bác sĩ sau khi khám)
// Chỉ có Bác sĩ chuyên môn và Admin được cập nhật. Bệnh nhân CHỈ ĐƯỢC XEM, không được sửa.
// --------------------------------------------------------------------------
router.put('/:id/medical-assessment', xacThucToken, phanQuyen('doctor', 'admin'), capNhatKhamBenhChuyenMon);

router.get('/me', xacThucToken, phanQuyen('patient', 'admin', 'doctor'), (req, res, next) => {
    // Ép cái ID giải mã từ Token vào params để dùng chung hàm getPatientById mà không cần viết lại code
    req.params.id = req.user.id; 
    next();
}, getPatientById);

// [GET] Lấy 1 bệnh nhân theo ID — Admin + Doctor + Patient (Đoạn này thêm 'patient' để bệnh nhân tự xem hồ sơ của mình nhé)
router.get('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), getPatientById);

// [PUT] Cập nhật thông tin hành chính bệnh nhân (Họ tên, SĐT, Địa chỉ...) — Admin + Doctor + Patient
router.put('/:id', xacThucToken, phanQuyen('admin', 'doctor', 'patient'), updatePatient);

// [DELETE] Xóa bệnh nhân — chỉ Admin
router.delete('/:id', xacThucToken, phanQuyen('admin'), deletePatient);

module.exports = router;
