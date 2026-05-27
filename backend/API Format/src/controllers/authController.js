// src/controllers/authController.js
// Chức năng: Xử lý đăng ký và đăng nhập tài khoản (Đã fix lỗi buffering timeout)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');   
const jwt = require('jsonwebtoken');  

// 🛠️ FIX TẠI CHỖ: Tạo kết nối riêng biệt (Isolated Connection) tới MongoDB Local 
// Cách này đảm bảo Model User kết nối THẲNG vào database local, chấp mọi lỗi cấu hình chạy ngầm của nhóm.
const localConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/vnmedid', {
    serverSelectionTimeoutMS: 5000
});

// Nạp Model User trực tiếp qua kết nối local này để không bị dính buffering timeout
const UserSchema = require('../models/User').schema || new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});
const User = localConnection.model('User', UserSchema);

localConnection.on('connected', () => console.log('🔥 [Fix OK] Model User đã thông mạch vào Database Local!'));
localConnection.on('error', (err) => console.log('❌ Lỗi kết nối local:', err));

// ===================================================
// ĐĂNG KÝ TÀI KHOẢN MỚI
// ===================================================
const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Bước 1: Kiểm tra email đã tồn tại chưa (Chạy siêu tốc qua kết nối local)
    const emailDaTonTai = await User.findOne({ email });
    if (emailDaTonTai) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng, vui lòng chọn email khác'
      });
    }

    // Bước 2: Mã hóa mật khẩu
    const matKhauDaMaHoa = await bcrypt.hash(password, 10);

    // Bước 3: Tạo user mới
    const userMoi = await User.create({
      fullName,
      email,
      password: matKhauDaMaHoa, 
      role
    });

    // Bước 4: Trả về kết quả thành công
    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công!',
      data: {
        userId: userMoi._id,
        fullName: userMoi.fullName,
        email: userMoi.email,
        role: userMoi.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại',
      error: error.message
    });
  }
};

// ===================================================
// ĐĂNG NHẬP
// ===================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Bước 1: Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Bước 2: So sánh mật khẩu
    const matKhauDung = await bcrypt.compare(password, user.password);
    if (!matKhauDung) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Bước 3: Tạo JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'vnmedid_super_secret_key_2024', 
      { expiresIn: '7d' }
    );

    // Bước 4: Trả về token cho FE
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        token,
        userId: user._id,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại',
      error: error.message
    });
  }
};

module.exports = { register, login };
