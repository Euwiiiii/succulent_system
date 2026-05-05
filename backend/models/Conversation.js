const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Ongoing', 'Resolved'], default: 'Pending' },
    assignedAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastMessage: { type: String },
    lastActivity: { type: Date, default: Date.now },
    unreadByAdmin: { type: Number, default: 0 },
    unreadByCustomer: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
