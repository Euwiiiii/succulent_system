const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['Soil', 'Pot', 'Fertilizer'] },
    bulkPrice: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    totalWeight: { type: Number, default: 0 }, // For Soil/Fertilizer
    quantity: { type: Number, default: 0 } // For Pots
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for unitCost
supplySchema.virtual('unitCost').get(function() {
    if (this.type === 'Pot') {
        if (!this.quantity || this.quantity === 0) return 0;
        return (this.bulkPrice + this.shippingFee) / this.quantity;
    } else {
        if (!this.totalWeight || this.totalWeight === 0) return 0;
        return (this.bulkPrice + this.shippingFee) / this.totalWeight;
    }
});

module.exports = mongoose.model('Supply', supplySchema);
