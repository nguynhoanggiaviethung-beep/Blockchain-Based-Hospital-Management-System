// API Format/src/controllers/doctorController.js
const mongoose = require('mongoose');
const Doctor = require('../models/doctor'); 
const User = require('../models/User'); // 🔥 ĐÃ THÊM: Import Model User để Mongoose kiểm soát lưu vào bảng 'users'
const bcrypt = require('bcrypt');

/**
 * @desc    Tạo hồ sơ bác sĩ mới (Gồm: Tạo tài khoản ở 'users' + Tạo hồ sơ ở 'doctors')
 * @route   POST /api/v1/doctors
 */
const createDoctor = async (req, res) => {
    try {
        const { fullName, specialty, licenseNumber, walletAddress, email, password } = req.body;

        // 1. KIỂM TRA ĐẦU VÀO
        if (!fullName || !licenseNumber || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng điền đầy đủ các trường bắt buộc (Họ tên, Số giấy phép, Email, Mật khẩu)!' 
            });
        }

        const db = mongoose.connection.db;
        if (!db) {
            return res.status(500).json({ success: false, message: 'Database chưa sẵn sàng!' });
        }

        // 2. KIỂM TRA TRÙNG LẶP (Quét email bên bảng users và licenseNumber bên bảng doctors)
        const isEmailExist = await db.collection('users').findOne({ email });
        const isLicenseExist = await Doctor.findOne({ licenseNumber });

        if (isEmailExist || isLicenseExist) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email hoặc Số giấy phép này đã được đăng ký trên hệ thống!' 
            });
        }

        // 3. MÃ HÓA MẬT KHẨU
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. BƯỚC CHỐT: LƯU VÀO 2 BẢNG ĐỒNG THỜI BẰNG ID CHUNG
        const commonId = new mongoose.Types.ObjectId(); 

        // Bước 4.1: Tạo tài khoản đăng nhập bên bảng 'users' bằng Model User
        const newUser = new User({
            _id: commonId,
            fullName,
            email,
            password: hashedPassword,
            role: 'doctor',
            walletAddress
        });
        await newUser.save();
        console.log(`✅ Đã lưu tài khoản vào bảng users với ID: ${commonId}`);

        // Bước 4.2: Lưu thông tin hồ sơ bên bảng 'doctors' bằng Native Driver (Tránh bẫy index cũ)
        await db.collection('doctors').insertOne({
            _id: commonId, 
            fullName,
            specialty,
            licenseNumber,
            walletAddress
        });
        console.log(`✅ Đã lưu hồ sơ vào bảng doctors với ID: ${commonId}`);

        // 5. PHẢN HỒI THÀNH CÔNG (Đoạn này cũ của bạn bị thiếu)
        return res.status(201).json({ 
            success: true, 
            message: 'Tạo tài khoản và hồ sơ bác sĩ thành công!',
            data: {
                id: commonId,
                fullName,
                email
            }
        });

    } catch (error) {
        console.error("❌ Lỗi tại createDoctor:", error);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi hệ thống khi tạo bác sĩ!', 
            error: error.message 
        });
    }
};

/**
 * @desc    Lấy chi tiết thông tin 1 bác sĩ bằng ID tài khoản (userId từ token)
 * @route   GET /api/v1/doctors/:id
 */
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Chuyển string ID nhận từ client về dạng ObjectId để tìm chính xác trong MongoDB
        const objId = new mongoose.Types.ObjectId(id);
        
        const doctor = await Doctor.findById(objId); 
        
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy thông tin hồ sơ của bác sĩ này!' 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            data: doctor 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi hệ thống khi truy vấn dữ liệu bác sĩ!', 
            error: error.message 
        });
    }
};

module.exports = {
    createDoctor,
    getDoctorById
};