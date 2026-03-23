const express = require('express');
const { createShopAvailability, getShopAvailabilityByShopId, checkAvailabilityByShopId } = require('../controllers/availability.controller');
const protect = require('../../../../middleware/userMiddleware');
const router = express.Router();

router.route('/').post(protect, createShopAvailability);
router.route('/:id').get(protect, getShopAvailabilityByShopId);
router.route('/check-shop-availability/:id').get(protect, checkAvailabilityByShopId);
module.exports = router;