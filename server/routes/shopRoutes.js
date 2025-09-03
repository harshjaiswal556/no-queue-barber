const express = require('express');
const { createShop, createShopAvailability, getShopByBarberId, getAllShops, getShopById, getShopAvailabilityByShopId } = require('../controllers/shopController');
const protect = require('../middleware/userMiddleware');
const router = express.Router();

router.route('/create').post(protect, createShop);
router.route('/availability').post(protect, createShopAvailability);
router.route('/availability/:id').get(protect, getShopAvailabilityByShopId);
router.get('/barber/:id', getShopByBarberId);
router.get('/list', getAllShops);
router.get('/list/:id', getShopById);

module.exports = router;