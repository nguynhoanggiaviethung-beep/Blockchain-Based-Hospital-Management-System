const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  prescription: { type: String, required: true }, // Nhận chuỗi từ FE theo roadmap
  ipfsHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
