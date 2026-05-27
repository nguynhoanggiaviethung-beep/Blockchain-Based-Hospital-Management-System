// src/controllers/authController.js
// Chức năng: Xử lý đăng ký và đăng nhập tài khoản

const User = require('../models/User');
const bcrypt = require('bcryptjs');   // Dùng để mã hóa mật khẩu
const jwt = require('jsonwebtoken');  // Dùng để tạo token

// ===================================================
// ĐĂNG KÝ TÀI KHOẢN MỚI
// Endpoint: POST /api/v1/auth/register
// Ai dùng: Admin tạo tài khoản cho bác sĩ / bệnh nhân
// ===================================================
const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Bước 1: Kiểm tra email đã tồn tại chưa
    const emailDaTonTai = await User.findOne({ email });
    if (emailDaTonTai) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng, vui lòng chọn email khác'
      });
    }

    // Bước 2: Mã hóa mật khẩu trước khi lưu vào database
    // Số 10 là độ phức tạp của mã hóa (càng cao càng an toàn nhưng càng chậm)
    const matKhauDaMaHoa = await bcrypt.hash(password, 10);

    // Bước 3: Tạo user mới và lưu vào database
    const userMoi = await User.create({
      fullName,
      email,
      password: matKhauDaMaHoa, // Lưu mật khẩu đã mã hóa, KHÔNG lưu mật khẩu gốc
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
// Endpoint: POST /api/v1/auth/login
// Ai dùng: Tất cả mọi người (admin, doctor, patient)
// ===================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Bước 1: Tìm user theo email trong database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Bước 2: So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
    const matKhauDung = await bcrypt.compare(password, user.password);
    if (!matKhauDung) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Bước 3: Tạo JWT Token
    // Token này FE sẽ lưu lại và gửi kèm mỗi lần gọi API
    const token = jwt.sign(
      // Nhúng thông tin user vào trong token
      { userId: user._id, role: user.role },
      // Khóa bí mật để ký token (lưu trong file .env)
      process.env.JWT_SECRET,
      // Token hết hạn sau 7 ngày
      { expiresIn: '7d' }
    );

    // Bước 4: Trả về token cho FE
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        token,               // FE lưu cái này vào localStorage
        userId: user._id,
        fullName: user.fullName,
        role: user.role      // FE dùng role để hiển thị đúng dashboard
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
