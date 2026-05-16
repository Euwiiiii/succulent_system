const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['Soil', 'Pot', 'Fertilizer'] },
    bulkPrice: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    totalWeight: { type: Number, default: 0 }, // For Soil/Fertilizer (Current Stock)
    quantity: { type: Number, default: 0 }, // For Pots (Current Stock)
    
    // Original Batch Sizes (Helps with future analytics and recalculations)
    originalWeight: { type: Number },
    originalQuantity: { type: Number },
    
    // Locked Unit Price
    unitCost: { type: Number }
}, { 
    timestamps: true
});

// Removed virtual field since unitCost is now locked and saved to the database directly.

module.exports = mongoose.model('Supply', supplySchema);
