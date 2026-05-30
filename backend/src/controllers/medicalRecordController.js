// src/controllers/medicalRecordController.js
const MedicalRecord = require('../models/MedicalRecord');

// POST /medical-records — Tạo hồ sơ bệnh án (Doctor)
const createMedicalRecord = async (req, res) => {
    try {
        const { visitId, patientId, doctorId, diagnosis, notes } = req.body;

        if (!visitId || !patientId || !doctorId || !diagnosis) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin bệnh án!'
            });
        }

        const mockIpfsHash = 'QmRecord' + Math.random().toString(36).substring(2, 15);

        const record = await MedicalRecord.create({
            visitId, patientId, doctorId, diagnosis, notes,
            ipfsHash: mockIpfsHash
        });

        return res.status(201).json({
            success: true,
            message: 'Tạo hồ sơ bệnh án thành công!',
            data: { recordId: record._id, ipfsHash: mockIpfsHash }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// GET /medical-records/patient/:patientId — Lấy tất cả bệnh án của bệnh nhân
const getMedicalRecordsByPatient = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patientId: req.params.patientId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách bệnh án thành công!',
            data: { total: records.length, records }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// GET /medical-records/:id — Xem chi tiết 1 bệnh án
const getMedicalRecordById = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hồ sơ bệnh án này!'
            });
        }

        return res.status(200).json({
            success: true,
            data: record
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// PUT /medical-records/:id — Cập nhật bệnh án (Doctor)
const updateMedicalRecord = async (req, res) => {
    try {
        const { diagnosis, notes } = req.body;
        const mockIpfsHash = 'QmUpdated' + Math.random().toString(36).substring(2, 15);

        const record = await MedicalRecord.findByIdAndUpdate(
            req.params.id,
            { diagnosis, notes, ipfsHash: mockIpfsHash },
            { new: true }
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hồ sơ bệnh án này!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật hồ sơ bệnh án thành công!',
            data: { updated: true, newIpfsHash: mockIpfsHash }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

module.exports = { createMedicalRecord, getMedicalRecordsByPatient, getMedicalRecordById, updateMedicalRecord };
