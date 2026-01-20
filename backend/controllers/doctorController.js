const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DoctorProfile = require('../models/DoctorProfile');

// Doctor signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const operatingHours = {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '18:00' },
        saturday: { start: '09:00', end: '14:00' },
        sunday: { start: 'Closed', end: 'Closed' },
      }

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const existingDoctor = await DoctorProfile.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(phone, salt);

    const newDoctor = new DoctorProfile({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      operatingHours
    });

    const savedDoctor = await newDoctor.save();

    const token = jwt.sign(
      { id: savedDoctor._id, email: savedDoctor.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Signup successful',
      doctor: savedDoctor,
      auth_token: token,
      expiresIn: 3600,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Doctor login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login :", email, password);

  try {
    // Find doctor by email
    const profile = await DoctorProfile.findOne({ email });
    if (!profile) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: profile._id, email: profile.email }, // payload
      process.env.JWT_SECRET,                    // secret key from .env
      { expiresIn: '1h' }                        // token expires in 1 hour
    );

    res.json({
      message: 'Login successful',
      doctor: profile,
      auth_token: token,
      expiresIn: 3600 // seconds until token expires
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDoctorById = async (req, res) => {
    try {
        const { id } = req.query;
        console.log("Received Doctor ID :", id);
        const doctor = await DoctorProfile.findById(id).select('-password');

        console.log("Doctor ID in backend :", doctor);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get doctor profile
exports.getDoctorProfile = async (req, res) => {
  try {
    // Exclude password field
    let profile = await DoctorProfile.find().select('-password');

    if (!profile || profile.length === 0) {
      // Create default profile if not exists
      const newProfile = new DoctorProfile({
        name: process.env.DOCTOR_NAME || 'Dr. Name',
        email: process.env.DOCTOR_EMAIL || 'doctor@example.com',
        phone: process.env.DOCTOR_PHONE || '+91-XXXXXXXXXX',
        address: process.env.DOCTOR_ADDRESS || 'Your Address Here',
      });

      await newProfile.save();

      // Return without password
      return res.json([newProfile.toObject({ getters: true, virtuals: false })]);
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update doctor profile (admin)
exports.updateDoctorProfile = async (req, res) => {
  try {
    let profile = await DoctorProfile.findOne();
    if (!profile) {
      profile = new DoctorProfile(req.body);
    } else {
      Object.assign(profile, req.body);
      profile.updatedAt = Date.now();
    }
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add work sample
exports.addWorkSample = async (req, res) => {
  try {
    const { title, description, image, date } = req.body;
    let profile = await DoctorProfile.findOne();
    
    if (!profile) {
      profile = new DoctorProfile({
        name: process.env.DOCTOR_NAME || 'Dr. Name',
        email: process.env.DOCTOR_EMAIL || 'doctor@example.com',
        phone: process.env.DOCTOR_PHONE || '+91-XXXXXXXXXX',
        address: process.env.DOCTOR_ADDRESS || 'Your Address Here',
      });
    }

    profile.workSamples.push({
      title,
      description,
      image,
      date: date || Date.now(),
    });

    const updatedProfile = await profile.save();
    res.status(201).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove work sample
exports.removeWorkSample = async (req, res) => {
  try {
    const { sampleId } = req.params;
    const profile = await DoctorProfile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.workSamples = profile.workSamples.filter(
      sample => sample._id.toString() !== sampleId
    );

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

