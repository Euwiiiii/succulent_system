const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['Admin', 'Customer'], required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
    productContext: {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
