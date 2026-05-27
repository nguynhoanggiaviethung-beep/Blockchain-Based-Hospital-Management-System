const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ==========================================
// CẤU HÌNH BIẾN MÔI TRƯỜNG (tạm hardcode)
// TODO: chuyển sang đọc file .env sau
// ==========================================
process.env.JWT_SECRET = 'vnmedid_super_secret_key_2024';

const app = express();

// ==========================================
// CÀI ĐẶT MIDDLEWARE CƠ BẢN
// ==========================================
app.use(cors());              // Cho phép Frontend gọi API từ domain khác
app.use(express.json());      // Tự động đọc dữ liệu JSON từ request body

// ==========================================
// ĐĂNG KÝ TẤT CẢ ROUTES (đường dẫn API)
// Mỗi dòng = 1 nhóm chức năng
// ==========================================
app.use('/api/v1/auth',            require('./API Format/src/routes/authRoutes'));           // Đăng ký, đăng nhập
app.use('/api/v1/patients',        require('./API Format/src/routes/patientRoutes'));        // Quản lý bệnh nhân
app.use('/api/v1/doctors',         require('./API Format/src/routes/doctorRoutes'));         // Quản lý bác sĩ
app.use('/api/v1/visits',          require('./API Format/src/routes/visitRoutes'));          // Quản lý lượt khám
app.use('/api/v1/medical-records', require('./API Format/src/routes/medicalRecordRoutes')); // Hồ sơ bệnh án
app.use('/api/v1/invoices',        require('./API Format/src/routes/invoiceRoutes'));        // Hóa đơn
app.use('/api/v1/access',          require('./API Format/src/routes/accessRoutes'));         // Phân quyền truy cập
app.use('/api/v1/payments',        require('./API Format/src/routes/paymentRoutes'));        // Thanh toán

// Route kiểm tra server có chạy không
app.get("/", (req, res) => {
    res.send("Backend đang chạy!");
});

// ==========================================
// KẾT NỐI MONGODB TRƯỚC RỒI MỚI KHỞI ĐỘNG SERVER
// Nếu không kết nối được DB thì server không chạy
// ==========================================
mongoose.connect('mongodb://localhost:27017/vnmedid', {
    serverSelectionTimeoutMS: 30000, // Chờ tối đa 30 giây để kết nối
    socketTimeoutMS: 45000           // Chờ tối đa 45 giây cho mỗi thao tác
})
    .then(() => {
        console.log('✅ Kết nối MongoDB thành công!');
        app.listen(5000, () => {
            console.log('✅ Server đang chạy tại cổng 5000');
        });
    })
    .catch((err) => {
        console.log('❌ Lỗi kết nối MongoDB:', err);
    });
    