const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  fullName:      { type: String, required: [true, 'Vui lòng nhập họ tên'] },
  specialty:     { type: String, required: [true, 'Vui lòng nhập chuyên khoa'] },
  licenseNumber: { type: String, required: [true, 'Vui lòng nhập số giấy phép'], unique: true },
  walletAddress: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
