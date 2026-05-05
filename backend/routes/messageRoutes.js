const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Basic middleware to check if user ID is present
const requireAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    
    if (userId && userRole) {
        req.user = { id: userId, role: userRole };
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized. User ID and Role required in headers.' });
    }
};

// Send a message
router.post('/', requireAuth, messageController.sendMessage);

// Admin: Get all conversations
router.get('/conversations', requireAuth, messageController.getConversations);

// Customer/Admin: Get a specific conversation by customer ID
router.get('/conversation/:customerId', requireAuth, messageController.getCustomerConversation);

// Get messages by conversation ID
router.get('/:conversationId', requireAuth, messageController.getMessages);

// Mark conversation as read
router.put('/mark-read', requireAuth, messageController.markAsRead);

// Admin: Update conversation status/assignee
router.put('/conversation/:conversationId/status', requireAuth, messageController.updateStatus);

module.exports = router;
