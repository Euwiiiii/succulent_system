const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, senderRole, senderName, content, productContext, customerId, customerName } = req.body;

        // Determine which customer the conversation is for
        const targetCustomerId = senderRole === 'Customer' ? senderId : customerId;
        const targetCustomerName = senderRole === 'Customer' ? senderName : customerName;

        if (!targetCustomerId) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({ customerId: targetCustomerId });

        if (!conversation) {
            conversation = new Conversation({
                customerId: targetCustomerId,
                customerName: targetCustomerName,
                status: 'Pending'
            });
            await conversation.save();
        }

        // Create the message
        const message = new Message({
            conversationId: conversation._id,
            senderId,
            senderRole,
            senderName,
            content,
            productContext
        });
        await message.save();

        // Update conversation
        conversation.lastMessage = content;
        conversation.lastActivity = new Date();
        
        if (senderRole === 'Customer') {
            conversation.unreadByAdmin += 1;
            // If the customer replies, it might go back to Ongoing if it was Resolved
            if (conversation.status === 'Resolved') {
                conversation.status = 'Pending';
            }
        } else {
            conversation.unreadByCustomer += 1;
            conversation.status = 'Ongoing';
            conversation.assignedAdminId = senderId;
        }

        await conversation.save();

        res.status(201).json({ message: 'Message sent', data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all conversations (for Admin)
exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find().sort({ lastActivity: -1 }).populate('assignedAdminId', 'username');
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a specific customer's conversation
exports.getCustomerConversation = async (req, res) => {
    try {
        const { customerId } = req.params;
        const conversation = await Conversation.findOne({ customerId }).populate('assignedAdminId', 'username');
        
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Mark conversation as read
exports.markAsRead = async (req, res) => {
    try {
        const { conversationId, userRole } = req.body;
        
        const update = {};
        if (userRole === 'Admin') {
            update.unreadByAdmin = 0;
        } else if (userRole === 'Customer') {
            update.unreadByCustomer = 0;
        }

        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { $set: update },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Marked as read', data: conversation });
    } catch (error) {
        console.error('Error marking as read:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update conversation status
exports.updateStatus = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { status, assignedAdminId } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (assignedAdminId) updateData.assignedAdminId = assignedAdminId;

        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { $set: updateData },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Status updated', data: conversation });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
