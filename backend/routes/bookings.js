const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Public/Guest allowed routes
router.post('/', optionalProtect, bookingController.createBooking);
router.post('/track', bookingController.trackBooking);

// Protected routes (Coolies/Logged-in Users)
router.get('/my-bookings', protect, bookingController.getUserBookings);
router.get('/coolie-tasks', protect, bookingController.getCoolieBookings);
router.get('/coolie-stats', protect, bookingController.getCoolieStats);
router.patch('/:id/status', protect, bookingController.updateBookingStatus);
router.post('/:id/rate', protect, bookingController.rateBooking);

module.exports = router;
