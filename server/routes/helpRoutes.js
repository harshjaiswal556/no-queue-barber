const express = require('express');
const protect = require('../middleware/userMiddleware');
const { createHelp } = require('../controllers/helpController');

const router = express.Router();

router.route('/help/:id').post(protect, createHelp);

module.exports = router;