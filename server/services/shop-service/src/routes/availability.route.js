const express = require('express');
const { createShopAvailability, getShopAvailabilityByShopId } = require('../controllers/availability.controller');
const protect = require('../../../../middleware/userMiddleware');
const router = express.Router();

router.route('/').post(protect, createShopAvailability);
router.route('/:id').get(protect, getShopAvailabilityByShopId);

module.exports = router;