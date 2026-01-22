const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const upload = require('../middleware/upload');

// Public routes
router.post('/', bookingController.createBooking);
router.get('/available-slots', bookingController.getAvailableSlots);
router.get('/by-email/:email', bookingController.getBookingsByEmail);
router.get('/:id', bookingController.getBookingById);
router.post(
  '/:id/complete',
  upload.single('prescription'),
  bookingController.completeBooking
);


// Admin routes
router.get('/', bookingController.getAllBookings);
router.put('/:id/status', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
