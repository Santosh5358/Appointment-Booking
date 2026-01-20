const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Dr.',
  },
  specializations: {
    type: [String],
    default: ['Physiotherapy', 'Acupuncture', 'Acupressure'],
  },
  bio: {
    type: String,
    default: '',
  },
  experience: {
    type: Number,
    default: 0,
  },
  profileImage: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  googleMapLink: {
    type: String,
    default: '',
  },
  workSamples: [{
    title: String,
    description: String,
    image: String,
    date: Date,
  }],
  consultationFee: {
    type: Number,
    default: 0,
  },
  operatingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  password: {
  type: String,
  required: true,
  },
  operatingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },  
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String },
    }  
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
