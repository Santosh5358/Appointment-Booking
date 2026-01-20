const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('./models/Service.js');
const DoctorProfile = require('./models/DoctorProfile.js');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await DoctorProfile.deleteMany({});

    // Create sample services
    const services = [
      {
        name: 'Deep Tissue Massage',
        description: 'Therapeutic massage targeting deep muscle layers to relieve tension and improve circulation',
        price: 500,
        duration: 60,
        category: 'Physiotherapy',
        isActive: true,
      },
      {
        name: 'Swedish Massage',
        description: 'Gentle, relaxing massage technique for stress relief and muscle relaxation',
        price: 400,
        duration: 45,
        category: 'Physiotherapy',
        isActive: true,
      },
      {
        name: 'Sports Massage',
        description: 'Specialized massage for athletes to improve performance and prevent injuries',
        price: 600,
        duration: 60,
        category: 'Physiotherapy',
        isActive: true,
      },
      {
        name: 'Acupuncture Treatment',
        description: 'Traditional Chinese medicine technique using thin needles for pain relief and wellness',
        price: 700,
        duration: 45,
        category: 'Acupuncture',
        isActive: true,
      },
      {
        name: 'Facial Acupuncture',
        description: 'Specialized acupuncture for facial rejuvenation and beauty enhancement',
        price: 800,
        duration: 60,
        category: 'Acupuncture',
        isActive: true,
      },
      {
        name: 'Acupressure Therapy',
        description: 'Non-invasive pressure point therapy for pain management and wellness',
        price: 400,
        duration: 45,
        category: 'Acupressure',
        isActive: true,
      },
      {
        name: 'Foot Acupressure',
        description: 'Reflexology and acupressure techniques for complete body rejuvenation',
        price: 350,
        duration: 45,
        category: 'Acupressure',
        isActive: true,
      },
      {
        name: 'Physical Therapy Consultation',
        description: 'Expert consultation for injury recovery and rehabilitation planning',
        price: 300,
        duration: 30,
        category: 'Physiotherapy',
        isActive: true,
      },
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`✓ ${createdServices.length} services created`);

    // Create doctor profile
    const doctorProfile = new DoctorProfile({
      name: process.env.DOCTOR_NAME || 'Sharma',
      title: 'Dr.',
      specializations: ['Physiotherapy', 'Acupuncture', 'Acupressure'],
      bio: 'Dedicated healthcare professional with extensive experience in physiotherapy, acupuncture, and acupressure treatments. Committed to providing holistic healthcare solutions and improving patient wellness through proven therapeutic techniques.',
      experience: 15,
      email: process.env.DOCTOR_EMAIL || 'doctor@example.com',
      phone: process.env.DOCTOR_PHONE || '+91-9876543210',
      address: process.env.DOCTOR_ADDRESS || '123 Medical Centre, Your City',
      googleMapLink: 'https://share.google/uv31U3RUDai9I1EDl',
      consultationFee: 500,
      operatingHours: {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '18:00' },
        saturday: { start: '09:00', end: '14:00' },
        sunday: { start: 'Closed', end: 'Closed' },
      },
      workSamples: [
        {
          title: 'Patient Recovery Success',
          description: 'Successfully treated sports injury with specialized physiotherapy techniques',
          date: new Date(),
        },
        {
          title: 'Acupuncture Treatment',
          description: 'Relief from chronic pain through traditional acupuncture methods',
          date: new Date(),
        },
        {
          title: 'Home Therapy Session',
          description: 'Convenient home-based treatment for senior citizens',
          date: new Date(),
        },
      ],
    });

    await doctorProfile.save();
    console.log('✓ Doctor profile created');

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nServices added: ${createdServices.length}`);
    console.log('Doctor profile initialized');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
