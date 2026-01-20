require('dotenv').config();
const twilio = require('twilio');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const DoctorProfile = require('../models/DoctorProfile');

const accountSid = 'AC4acc4e47bee17ce473195248884ea6c4';   // Twilio Account SID
const authToken = 'b4123452ec1d3e98dcb1b59b97bfa367';     // Twilio Auth Token
const client = twilio(accountSid, authToken);


/**
 * Send WhatsApp message
 * @param {string} toNumber - WhatsApp number in format +91XXXXXXXXXX
 * @param {string} message - Message text
 */
const sendWhatsAppMessage = async (toNumber, message) => {
  try {
    const msg = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+91${toNumber}`,
      body: message
    });
    console.log('Message sent: ', msg.sid);
  } catch (err) {
    console.error('Error sending WhatsApp message:', err.message);
  }
};


/**
 * Helper to get email content based on booking status
 */
function getMailOptionsByStatus(booking) {
  const {
    patientName,
    patientEmail,
    appointmentDate,
    appointmentTime,
    service,
    doctor,
    status
  } = booking;

  // Pending booking email
  if (status !== 'confirmed') {
    return {
      from: process.env.SMTP_USER,
      to: patientEmail,
      subject: `Appointment Booked with Dr. ${doctor.name}`,
      text: `
Hello ${patientName},

Your appointment has been successfully booked with Dr. ${doctor.name}.

Service: ${service.name}
Appointment Date: ${appointmentDate.toDateString()}
Appointment Time: ${appointmentTime}
Visit Address: ${doctor.address}

Please note that your appointment is currently pending confirmation.
You will receive another email once the doctor confirms your booking.

Thank you for choosing our clinic.

Best regards,
Your Clinic Team
      `,
    };
  }

  // Doctor confirmed email
  return {
    from: process.env.SMTP_USER,
    to: patientEmail,
    subject: `Your Appointment with Dr. ${doctor.name} is Confirmed`,
    text: `
Hello ${patientName},

Good news! Your appointment with Dr. ${doctor.name} has been confirmed.

Service: ${service.name}
Appointment Date: ${appointmentDate.toDateString()}
Appointment Time: ${appointmentTime}
Visit Address: ${doctor.address}

Please arrive a few minutes early for your appointment.
We look forward to seeing you.

Best regards,
Your Clinic Team
    `,
  };
}


/**
 * Send appointment confirmation via WhatsApp and Email
 */
async function sendAppointmentNotifications(booking) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // WhatsApp message content
    const whatsappMessage = `
Hello ${booking.patientName}!

Your appointment with Dr. ${booking.doctor.name}
Date: ${booking.appointmentDate.toDateString()}
Time: ${booking.appointmentTime}
Service: ${booking.service.name}
Status: ${booking.status}
    `;

    await sendWhatsAppMessage(booking.patientPhone, whatsappMessage);

    // Email content based on status
    const mailOptions = getMailOptionsByStatus(booking);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}

// module.exports = { sendAppointmentNotifications };


// ================= CREATE BOOKING =================
exports.createBooking = async (req, res) => {
  const { patientName, patientEmail, patientPhone, patientAddress, service, doctor, appointmentDate, appointmentTime, notes } = req.body;

  try {
    // Validate service exists
    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const doctorExists = await DoctorProfile.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const booking = new Booking({
      patientName,
      patientEmail,
      patientPhone,
      patientAddress,
      service,
      doctor,
      appointmentDate,
      appointmentTime,
      notes,
      status: 'pending' // default status
    });

    const savedBooking = await booking.save();
    const populatedBooking = await savedBooking.populate(['service', 'doctor']);

    // Send notifications
    await sendAppointmentNotifications(populatedBooking);

    res.status(201).json({
      message: 'Booking created successfully. Awaiting confirmation.',
      booking: populatedBooking,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ================= GET BOOKINGS =================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate(['service', 'doctor']).sort({ appointmentDate: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const doctorId = req.params.id;
    console.log("Doctor ID :", doctorId);
    const bookings = await Booking.find({ doctor: doctorId })
      .populate(['service', 'doctor'])
      .sort({ appointmentDate: 1 });

      console.log("Bookings :", bookings);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this doctor' });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await Booking.find({ patientEmail: email }).populate(['service', 'doctor']).sort({ appointmentDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE STATUS =================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate(['service', 'doctor']);

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Send email & WhatsApp if doctor confirms
    if (status === 'confirmed') {
      await sendAppointmentNotifications(updatedBooking);
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ================= DELETE BOOKING =================
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET AVAILABLE SLOTS =================
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    const appointmentDate = new Date(date);

    // All possible slots (could also come from doctor profile)
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '14:00', '15:00', '16:00', '17:00'
    ];

    // Get booked slots for this doctor on the given date
    const bookings = await Booking.find({ doctor: doctorId, appointmentDate });
    const bookedSlots = bookings.map(b => b.appointmentTime);
     res.status(200).json({ allSlots, bookedSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
