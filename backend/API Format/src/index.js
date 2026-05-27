const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/v1/patients',        require('./routes/patientRoutes'));
app.use('/api/v1/doctors',         require('./routes/doctorRoutes'));
app.use('/api/v1/visits',          require('./routes/visitRoutes'));
app.use('/api/v1/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/v1/invoices',        require('./routes/invoiceRoutes'));
app.use('/api/v1/access',          require('./routes/accessRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('❌ MongoDB error:', err));
