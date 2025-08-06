const express = require('express');
const { createBooking } = require('../controllers/bookingController');
const protect = require('../middleware/userMiddleware');

const router = express.Router();

router.route('/create').post(protect, createBooking);

module.exports = router;