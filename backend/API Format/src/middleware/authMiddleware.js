// src/middleware/authMiddleware.js
// Chức năng: Kiểm tra token và phân quyền trước khi vào API

const jwt = require('jsonwebtoken');

// ==========================================
// MIDDLEWARE 1: Kiểm tra đã đăng nhập chưa
// ==========================================
const xacThucToken = (req, res, next) => {
    // Lấy token từ Header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục'
        });
    }

    try {
        // 🔥 FIX TẠI CHỖ: Đồng bộ chìa khóa gốc của nhóm để tránh lỗi token không hợp lệ
        const secretKey = process.env.JWT_SECRET || 'medical_blockchain_secret';
        
        // Giải mã token
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Lưu thông tin user vào request (gồm userId và role)
        next(); // Cho đi tiếp
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

// ==========================================
// MIDDLEWARE 2: Kiểm tra role có đúng không
// Dùng: phanQuyen('admin') hoặc phanQuyen('admin', 'doctor')
// ==========================================
const phanQuyen = (...roles) => {
    return (req, res, next) => {
        // 🔥 FIX BẢO VỆ: Thêm dấu ? (req.user?.role) để lỡ req.user bị undefined thì không bị sập server
        if (!req.user || !roles.includes(req.user?.role)) {
            return res.status(403).json({
                success: false,
                message: `Bạn không có quyền thực hiện chức năng này. Yêu cầu role: ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = { xacThucToken, phanQuyen };
