const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName:  { type: String, required: [true, 'Vui lòng nhập họ tên'] },
  dob:       { type: String, required: [true, 'Vui lòng nhập ngày sinh'] },
  gender:    { type: String, required: [true, 'Vui lòng nhập giới tính'] },
  phone:     { type: String, required: [true, 'Vui lòng nhập số điện thoại'] },
  address:   { type: String, required: [true, 'Vui lòng nhập địa chỉ'] },
  citizenId: { type: String, required: [true, 'Vui lòng nhập số CCCD'], unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);