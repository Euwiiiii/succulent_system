const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    customerUsername: { type: String, required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
