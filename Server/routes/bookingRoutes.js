const express = require('express');
const { createBooking, getBookingByCustomerId } = require('../controllers/bookingController');
const protect = require('../middleware/userMiddleware');

const router = express.Router();

router.route('/create').post(protect, createBooking);
router.route('/list/customer/:customer_id').get(protect, getBookingByCustomerId);

module.exports = router;