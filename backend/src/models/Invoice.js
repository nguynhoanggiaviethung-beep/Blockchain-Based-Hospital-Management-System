const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId:     { type: String, required: true, unique: true },
  patientId:     { type: String, required: true },  
  visitId:       { type: String },                   
  amount:        { type: Number, required: true },
  txHash:        { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
