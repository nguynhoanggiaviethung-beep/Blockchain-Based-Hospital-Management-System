const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const JWT_SECRET = 'vnmedid_super_secret_key_2024';
const MONGO_URI = 'mongodb://127.0.0.1:27017/vnmedid';
const PORT = 5000;

process.env.JWT_SECRET = JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

// DEBUG: In ra mọi request để dễ theo dõi flow
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
});

// 1. NẠP CÁC ROUTE (Tách độc lập giúp khởi động mạch lạc)
app.use('/api/v1/auth',             require('./API Format/src/routes/authRoutes'));
app.use('/api/v1/patients',        require('./API Format/src/routes/patientRoutes'));
app.use('/api/v1/doctors',         require('./API Format/src/routes/doctorRoutes'));
app.use('/api/v1/visits',          require('./API Format/src/routes/visitRoutes'));
app.use('/api/v1/medical-records', require('./API Format/src/routes/medicalRecordRoutes'));
app.use('/api/v1/invoices',        require('./API Format/src/routes/invoiceRoutes'));
app.use('/api/v1/access',          require('./API Format/src/routes/accessRoutes'));
app.use('/api/v1/payments',        require('./API Format/src/routes/paymentRoutes'));

app.get("/", (req, res) => {
    res.send("Backend VNmedID đang chạy!");
});

// 2. KHỞI ĐỘNG SERVER PORT 5000
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});

// 3. KẾT NỐI DATABASE MONGO
mongoose.connect(MONGO_URI, {
    directConnection: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
})
.then(() => {
    console.log('✅ Kết nối MongoDB thành công!');
})
.catch((err) => {
    console.log('❌ Lỗi kết nối MongoDB:', err.message);
});