// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     type: { type: String, required: true }, // e.g., cactus, echeveria
//     costPrice: { type: Number, required: true },
//     sellingPrice: { type: Number, required: true },
//     stockQuantity: { type: Number, required: true, min: 0 },
//     imageUrl: { type: String }
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

// Sub-schema for the individual plants
const plantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cost: { type: Number, required: true }
});

// Main Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    
    // Advanced Costing Fields
    plants: [plantSchema], 
    pot: { type: mongoose.Schema.Types.ObjectId, ref: 'Supply' },
    potCost: { type: Number, default: 0 }, // Kept for backwards compatibility
    supplies: [{
        supply: { type: mongoose.Schema.Types.ObjectId, ref: 'Supply' },
        gramsUsed: { type: Number, default: 0 }
    }],
    laborCost: { type: Number, default: 0 },
    markupPercentage: { type: Number, default: 50 },
    
    // Final Calculated Prices
    totalCost: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    
    // Inventory
    stockQuantity: { type: Number, required: true, min: 0 },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);