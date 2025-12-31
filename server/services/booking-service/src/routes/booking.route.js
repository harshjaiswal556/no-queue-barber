const express = require('express');
const { createBooking, getBookingByCustomerId, cancelBookingByBookingId, getBookingsByShopId, updateBookingPaymentStatus } = require('../controllers/booking.controller');
const protect = require('../../../../middleware/userMiddleware');

const router = express.Router();

router.route('/create').post(protect, createBooking);
router.route('/list/customer/:customer_id').get(protect, getBookingByCustomerId);
router.route('/cancel/:booking_id').put(protect, cancelBookingByBookingId);
router.route('/list/shop/:shop_id').get(protect, getBookingsByShopId);
router.route('/status/:booking_id').put(protect, updateBookingPaymentStatus);

module.exports = router;