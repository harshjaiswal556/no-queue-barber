const express = require('express');
const { createShop, createShopAvailability } = require('../controllers/shopController');
const protect = require('../middleware/userMiddleware');
const router = express.Router();

router.route('/create').post(protect, createShop);
router.route('/availability').post(protect, createShopAvailability);

module.exports = router;