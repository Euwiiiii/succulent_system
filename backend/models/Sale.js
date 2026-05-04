const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantitySold: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
