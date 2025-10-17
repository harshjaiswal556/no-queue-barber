const express = require('express');
const protect = require('../middleware/userMiddleware');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.route('/create-order/:id').post(protect, createOrder);
router.route('/verify-and-update').post(protect, verifyPayment);

module.exports = router;