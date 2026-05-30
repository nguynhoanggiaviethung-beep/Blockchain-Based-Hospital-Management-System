const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true  // mỗi bệnh nhân chỉ có 1 hồ sơ
  },
  nhomMau:    { type: String, enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-",""] , default: "" },
  tienSuBenh: { type: String, default: "" },
  diUng:      { type: [String], default: [] },  // mảng tên thuốc
  trieuChung: { type: String, default: "" },
  ghiChu:     { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('HealthProfile', healthProfileSchema);