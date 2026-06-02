// src/controllers/medicalRecordController.js
const MedicalRecord = require('../models/MedicalRecord');

// 1. Tạo bệnh án — Doctor
const createMedicalRecord = async (req, res) => {
    try {
        return res.status(201).json({ success: true, message: "Tạo bệnh án thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Lấy tất cả bệnh án của 1 bệnh nhân
const getMedicalRecordsByPatient = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient: req.params.patientId });
        return res.status(200).json({ success: true, data: records });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Lấy bệnh án theo ID
const getMedicalRecordById = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: "Không tìm thấy bệnh án" });
        return res.status(200).json({ success: true, data: record });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Cập nhật bệnh án theo ID — Doctor
const updateMedicalRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!record) return res.status(404).json({ success: false, message: "Không tìm thấy bệnh án" });
        return res.status(200).json({ success: true, data: record });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Lấy hồ sơ của bệnh nhân đang đăng nhập
const getMyRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findOne({ patient: req.user.id });
        if (!record) return res.status(404).json({ success: false, message: "Chưa có hồ sơ" });
        return res.status(200).json(record);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 6. Bệnh nhân tự cập nhật hồ sơ của mình
const updateMyRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findOneAndUpdate(
            { patient: req.user.id },
            req.body,
            { new: true, upsert: true }
        );
        return res.status(200).json(record);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createMedicalRecord,
    getMedicalRecordsByPatient,
    getMedicalRecordById,
    updateMedicalRecord,
    getMyRecord,
    updateMyRecord,
};