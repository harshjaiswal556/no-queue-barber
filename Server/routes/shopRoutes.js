const express = require('express');
const { createShop, createShopAvailability, getShopByBarberId, getAllShops } = require('../controllers/shopController');
const protect = require('../middleware/userMiddleware');
const router = express.Router();

router.route('/create').post(protect, createShop);
router.route('/availability').post(protect, createShopAvailability);
router.get('/barber/:id', getShopByBarberId);
router.get('/list', getAllShops);

module.exports = router;