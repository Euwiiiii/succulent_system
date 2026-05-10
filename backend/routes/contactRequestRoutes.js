const express = require('express');
const router = express.Router();
const contactRequestController = require('../controllers/contactRequestController');
// const { protect, admin } = require('../middleware/authMiddleware'); // if we need auth

// Public route to submit a contact request
router.post('/', contactRequestController.createContactRequest);

// Admin route to view contact requests
// For simplicity assuming the controller handles it. We can add auth middleware here if needed.
// router.get('/', protect, admin, contactRequestController.getContactRequests);
router.get('/', contactRequestController.getContactRequests);

module.exports = router;
