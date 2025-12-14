const express = require('express');
const protect = require('../../../../middleware/userMiddleware');
const { createOrder, verifyPayment, updatePaymentStatus } = require('../controllers/create-payment.controller');

const router = express.Router();

router.route('/create-order/:id').post(protect, createOrder);
router.route('/verify-and-update').post(protect, verifyPayment);
router.route('/payment-status/update/:id').put(protect, updatePaymentStatus);

module.exports = router;