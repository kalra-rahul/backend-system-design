// /models/Patient.js
const mongoose = require('mongoose');
const { encrypt } = require('../utils/crypto');

const patientSchema = new mongoose.Schema({
  name: String,
  contact: String,
  medicalHistory: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

patientSchema.pre('save', function (next) {
  if (this.isModified('contact')) {
    this.contact = encrypt(this.contact);
  }
  if (this.isModified('medicalHistory')) {
    this.medicalHistory = encrypt(this.medicalHistory);
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Patient', patientSchema);