// API Format/src/controllers/authController.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 🔥 ĐẢM BẢO CÓ TỪ KHÓA async Ở ĐÂY
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body; 
        console.log(`📨 [LOGIN INPUT]: Email: ${email} | Role: ${role}`);

        const db = mongoose.connection.db;
        if (!db) {
            return res.status(500).json({ success: false, message: 'Database chưa sẵn sàng!' });
        }

        // Xác định bảng dữ liệu (collection) dựa vào vai trò chọn ngoài Frontend
        let collectionName = 'users'; 
        if (role === 'doctor') collectionName = 'doctors';
        if (role === 'patient') collectionName = 'patients';

        // Tìm tài khoản theo email
        const user = await db.collection(collectionName).findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: `Tài khoản không tồn tại trong danh sách ${role}!`
            });
        }

        // Kiểm tra mật khẩu (Bypass linh hoạt: Đúng hash bcrypt HOẶC gõ trùng chuỗi thô HOẶC gõ "123456")
        const isMatch = await bcrypt.compare(password, user.password).catch(() => false);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        // Tạo JWT Token phân quyền
        const secretKey = process.env.JWT_SECRET || 'vnmedid_super_secret_key_2024';
        const token = jwt.sign(
            { userId: user._id, role: role }, 
            secretKey,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: {
                token,
                role: role,
                fullName: user.fullName || 'Người dùng VNmedID'
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi xử lý server nội bộ',
            error: error.message
        });
    }
};

const register = async (req, res) => { res.status(200).json({ success: true }); };

module.exports = { login, register };