const express = require('express');
const router = express.Router();
const { getSales } = require('../controllers/saleController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', requireAdmin, getSales);

module.exports = router;
