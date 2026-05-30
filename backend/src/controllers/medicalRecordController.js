// API Format/src/controllers/medicalRecordController.js
const MedicalRecord = require('../models/MedicalRecord'); // ← đảm bảo đã import model

// 1. Hàm tạo bệnh án mới
const createRecord = async (req, res) => {
    try {
        return res.status(201).json({ success: true, message: "Tạo bệnh án thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Hàm lấy chi tiết bệnh án
const getRecordById = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "Lấy chi tiết bệnh án thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ THÊM MỚI: Lấy hồ sơ của bệnh nhân đang đăng nhập
const getMyRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findOne({ patient: req.user.id });
        if (!record) return res.status(404).json({ success: false, message: "Chưa có hồ sơ" });
        return res.status(200).json(record);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ THÊM MỚI: Cập nhật hồ sơ của bệnh nhân đang đăng nhập
const updateMyRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findOneAndUpdate(
            { patient: req.user.id },
            req.body,
            { new: true, upsert: true } // upsert: tạo mới nếu chưa có
        );
        return res.status(200).json(record);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 🔥 EXPORT — thêm 2 hàm mới vào đây
module.exports = {
    createRecord,
    getRecordById,
    getMyRecord,    // ← thêm
    updateMyRecord, // ← thêm
};