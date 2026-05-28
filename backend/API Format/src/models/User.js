// src/models/User.js
const mongoose = require('mongoose');

// Định nghĩa cấu trúc bảng Người dùng (User Schema)
const userSchema = new mongoose.Schema({
  // Họ và tên người dùng - Bắt buộc phải nhập
  fullName: { 
    type: String, 
    required: [true, 'Vui lòng nhập họ và tên'] 
  },

  // Địa chỉ Email - Bắt buộc nhập và không được trùng lặp trong hệ thống
  email: { 
    type: String, 
    required: [true, 'Vui lòng nhập địa chỉ email'], 
    unique: true 
  },

  // Mật khẩu tài khoản - Bắt buộc phải nhập
  password: { 
    type: String, 
    required: [true, 'Vui lòng nhập mật khẩu'] 
  },

  // Vai trò/Phân quyền trong hệ thống - Chỉ được phép chọn 1 trong 3 vai trò dưới đây
  role: { 
    type: String, 
    enum: {
      values: ['admin', 'doctor', 'patient'],
      message: 'Vai trò không hợp lệ! Chỉ được chọn: admin, doctor, hoặc patient.'
    }, 
    default: 'patient' // Nếu đăng ký tài khoản bình thường thì mặc định là Bệnh nhân
  }
}, { 
  // Tự động thêm 2 trường: createdAt (ngày tạo) và updatedAt (ngày chỉnh sửa) vào database
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);

