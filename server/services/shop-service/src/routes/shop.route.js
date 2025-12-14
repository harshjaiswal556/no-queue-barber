const express = require('express');
const { createShop, getShopByBarberId, getAllShops, getShopById } = require('../controllers/shop.controller');
const protect = require('../../../../middleware/userMiddleware');
const router = express.Router();

router.route('/create').post(protect, createShop);
router.get('/barber/:id', getShopByBarberId);
router.get('/list', getAllShops);
router.get('/list/:id', getShopById);

module.exports = router;