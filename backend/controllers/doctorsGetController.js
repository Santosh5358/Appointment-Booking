const DoctorProfile = require('../models/DoctorProfile');

// Get all doctors (Admin)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create doctor (Admin)
exports.createDoctor = async (req, res) => {
  try {
    const { title, name, email, phone, address, experience, bio, specializations } = req.body;
    
    const doctor = new DoctorProfile({
      title,
      name,
      email,
      phone,
      address,
      experience,
      bio,
      specializations: specializations || []
    });
    
    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update doctor by ID (Admin)
exports.updateDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await DoctorProfile.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete doctor (Admin)
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await DoctorProfile.findByIdAndDelete(id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
