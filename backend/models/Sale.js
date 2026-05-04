const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    quantitySold: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    unitSellingPrice: { type: Number, default: 0 },
    unitCostPrice: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
