const express = require('express');
const { createBooking, getBookingByCustomerId, cancelBookingByBookingId } = require('../controllers/booking.controller');
const protect = require('../../../../middleware/userMiddleware');

const router = express.Router();

router.route('/create').post(protect, createBooking);
router.route('/list/customer/:customer_id').get(protect, getBookingByCustomerId);
router.route('/cancel/:booking_id').put(protect, cancelBookingByBookingId);

module.exports = router;