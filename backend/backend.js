const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Hardcode tạm để chạy được, fix env sau
process.env.JWT_SECRET = 'vnmedid_super_secret_key_2024';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth',            require('./API Format/src/routes/authRoutes'));
app.use('/api/v1/patients',        require('./API Format/src/routes/patientRoutes'));
app.use('/api/v1/doctors',         require('./API Format/src/routes/doctorRoutes'));
app.use('/api/v1/visits',          require('./API Format/src/routes/visitRoutes'));
app.use('/api/v1/medical-records', require('./API Format/src/routes/medicalRecordRoutes'));
app.use('/api/v1/invoices',        require('./API Format/src/routes/invoiceRoutes'));
app.use('/api/v1/access',          require('./API Format/src/routes/accessRoutes'));
app.use('/api/v1/payments',        require('./API Format/src/routes/paymentRoutes'));

app.get("/", (req, res) => {
    res.send("Backend running");
});

mongoose.connect('mongodb://localhost:27017/vnmedid')
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(5000, () => {
            console.log('✅ Server running on port 5000');
        });
    })
    .catch((err) => {
        console.log('❌ MongoDB error:', err);
    });
    