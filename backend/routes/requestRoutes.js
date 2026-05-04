const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { createRequest, getRequests, resolveRequest } = require('../controllers/requestController');

// Customers can create requests
router.post('/', createRequest);

// Only Admins can view and resolve requests
router.get('/', requireAdmin, getRequests);
router.patch('/:id/resolve', requireAdmin, resolveRequest);

module.exports = router;
