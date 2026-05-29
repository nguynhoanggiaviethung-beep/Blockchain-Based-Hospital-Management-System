// API Format/src/controllers/doctorController.js
const Doctor = require('../models/doctor');
const bcrypt = require('bcrypt');

// 1. Hàm tạo bác sĩ (Chúng ta vừa cập nhật ở bước trước)
const createDoctor = async (req, res) => {
    try {
        // ... [Giữ nguyên code hàm createDoctor của bạn] ...
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// 🔥 BỔ SUNG: Hàm lấy thông tin bác sĩ theo ID (Đang bị thiếu dẫn đến lỗi)
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id).select('-password'); // Lấy thông tin trừ mật khẩu ra
        
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ!' });
        }
        
        return res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// 🔥 ĐOẠN MODULE EXPORTS Ở DÒNG 57+
module.exports = {
    createDoctor,
    getDoctorById // Bây giờ hàm này đã tồn tại ở trên nên sẽ không còn lỗi nữa!
};