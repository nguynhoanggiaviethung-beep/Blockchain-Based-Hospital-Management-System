// API Format/src/controllers/patientController.js
// Module 2 — Patient CRUD API

const Patient = require('../models/Patient');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');     

// ==========================================
// POST /api/v1/patients
// Tạo bệnh nhân mới — Đồng bộ sang bảng 'users' để đăng nhập được liền
// ==========================================
const createPatient = async (req, res) => {
    try {
        const { fullName, dob, gender, phone, address, citizenId, email, password, walletAddress } = req.body;

        // 1. Kiểm tra các trường bắt buộc
        if (!fullName || !citizenId || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ các trường bắt buộc (Họ tên, CCCD, Email, Mật khẩu)!'
            });
        }

        const db = mongoose.connection.db;
        if (!db) {
            return res.status(500).json({ success: false, message: 'Database chưa sẵn sàng!' });
        }

        // 2. Kiểm tra trùng lặp (CCCD bên bảng patients và Email bên bảng users)
        const daCoBenh = await Patient.findOne({ citizenId });
        const daCoEmail = await db.collection('users').findOne({ email });

        if (daCoBenh || daCoEmail) {
            return res.status(400).json({
                success: false,
                message: 'Số CCCD hoặc Địa chỉ Email này đã được đăng ký trên hệ thống!'
            });
        }

        // 3. Mã hóa mật khẩu đăng nhập cho bệnh nhân
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. BƯỚC CHỐT: ÉP LƯU VÀO 2 BẢNG ĐỒNG THỜI BẰNG CHUNG 1 ID
        const commonId = new mongoose.Types.ObjectId();

        // Bước 4.1: Ép lưu thông tin đăng nhập vào collection 'users'
        await db.collection('users').insertOne({
            _id: commonId,
            fullName,
            email,
            password: hashedPassword,
            role: 'patient', 
            walletAddress: walletAddress || '',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Đã đồng bộ tài khoản đăng nhập bên bảng users: ${commonId}`);

        // Bước 4.2: Ép lưu thông tin hành chính vào collection 'patients' với CÙNG MÃ ID
        await db.collection('patients').insertOne({
            _id: commonId, 
            fullName,
            dob,
            gender,
            phone,
            address,
            citizenId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Đã đồng bộ thông tin hồ sơ bên bảng patients: ${commonId}`);

        return res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản và tạo hồ sơ bệnh nhân thành công!',
            data: { 
                patientId: commonId,
                fullName,
                email
            }
        });

    } catch (error) {
        console.error("❌ Lỗi tại createPatient:", error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi tạo bệnh nhân',
            error: error.message
        });
    }
};

// ==========================================
// GET /api/v1/patients
// Lấy danh sách tất cả bệnh nhân — Admin + Doctor
// ==========================================
const getAllPatients = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};

        if (search) {
            filter = {
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { citizenId: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const danhSach = await Patient.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách bệnh nhân thành công',
            data: {
                total: danhSach.length,
                patients: danhSach
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
            error: error.message
        });
    }
};

// ==========================================
// GET /api/v1/patients/:id
// Lấy thông tin 1 bệnh nhân — Admin + Doctor + Patient
// ==========================================
const getPatientById = async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const { ObjectId } = mongoose.Types;

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
        }

        const benhNhan = await db.collection('patients')
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!benhNhan) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân này' });
        }

        return res.status(200).json({ success: true, data: benhNhan });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// ==========================================
// PUT /api/v1/patients/:id
// Cập nhật thông tin hành chính bệnh nhân — Admin + Doctor + Patient
// ==========================================
const updatePatient = async (req, res) => {
    try {
        const { fullName, dob, gender, phone, address } = req.body;

        const benhNhan = await Patient.findByIdAndUpdate(
            req.params.id,
            { fullName, dob, gender, phone, address },
            { new: true, runValidators: true }
        );

        if (!benhNhan) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bệnh nhân này'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin bệnh nhân thành công!',
            data: benhNhan
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
            error: error.message
        });
    }
};

// ==========================================
// DELETE /api/v1/patients/:id
// Xóa bệnh nhân — chỉ Admin
// ==========================================
const deletePatient = async (req, res) => {
    try {
        const benhNhan = await Patient.findByIdAndDelete(req.params.id);

        if (!benhNhan) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bệnh nhân này'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Xóa bệnh nhân thành công!'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
            error: error.message
        });
    }
};

// ==========================================
const capNhatHoSoSucKhoe = async (req, res) => {
    try {
        const { nhomMau, tienSuBenh, diUng, trieuChung, ghiChu } = req.body;
        const db = mongoose.connection.db;
        const { ObjectId } = mongoose.Types;

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
        }

        const result = await db.collection('patients').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { nhomMau, tienSuBenh, diUng, trieuChung, ghiChu, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân!' });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật hồ sơ sức khỏe thành công!',
            data: result
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// ==========================================
// PUT /api/v1/patients/:id/medical-assessment
// LUỒNG 2: Bác sĩ cập nhật kết quả khám bệnh chuyên môn
// ==========================================
const capNhatKhamBenhChuyenMon = async (req, res) => {
    try {
        const { chanDoanChuyenMon, ghiChuBacSi, huongDieuTri } = req.body;

        if (!chanDoanChuyenMon) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập chẩn đoán chuyên môn của Bác sĩ!'
            });
        }

        const benhNhan = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    medicalAssessment: {
                        chanDoanChuyenMon,
                        ghiChuBacSi,
                        huongDieuTri,
                        updatedBy: req.user ? req.user.id : null, 
                        updatedAt: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!benhNhan) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bệnh nhân để cập nhật hồ sơ chuyên môn!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Bác sĩ cập nhật kết quả khám chuyên môn thành công!',
            data: benhNhan
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi cập nhật hồ sơ chuyên môn',
            error: error.message
        });
    }
};

// Xuất bản toàn bộ các hàm ra ngoài để File Routes sử dụng
module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    capNhatHoSoSucKhoe,
    capNhatKhamBenhChuyenMon 
};