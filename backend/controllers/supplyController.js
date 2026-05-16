const Supply = require('../models/Supply');

// Get all supplies (with auto-migration for old records)
exports.getSupplies = async (req, res) => {
    try {
        const supplies = await Supply.find();
        
        // Auto-fix old records that don't have a fixed unitCost or original sizes
        let needsSave = false;
        for (let supply of supplies) {
            needsSave = false;
            if (supply.unitCost === undefined || supply.unitCost === null) {
                if (supply.type === 'Pot') {
                    supply.unitCost = supply.quantity > 0 ? (supply.bulkPrice + supply.shippingFee) / supply.quantity : 0;
                } else {
                    supply.unitCost = supply.totalWeight > 0 ? (supply.bulkPrice + supply.shippingFee) / supply.totalWeight : 0;
                }
                needsSave = true;
            }
            if (supply.originalWeight === undefined && supply.type !== 'Pot') {
                supply.originalWeight = supply.totalWeight;
                needsSave = true;
            }
            if (supply.originalQuantity === undefined && supply.type === 'Pot') {
                supply.originalQuantity = supply.quantity;
                needsSave = true;
            }
            if (needsSave) {
                await supply.save();
            }
        }

        res.json(supplies);
    } catch (error) {
        console.error("GET SUPPLIES ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// Add a new supply
exports.createSupply = async (req, res) => {
    try {
        const { name, type, bulkPrice, shippingFee, totalWeight, quantity } = req.body;
        
        const bPrice = Number(bulkPrice) || 0;
        const sFee = Number(shippingFee) || 0;
        const tWeight = Number(totalWeight) || 0;
        const qty = Number(quantity) || 0;

        let unitCost = 0;
        if (type === 'Pot') {
            unitCost = qty > 0 ? (bPrice + sFee) / qty : 0;
        } else {
            unitCost = tWeight > 0 ? (bPrice + sFee) / tWeight : 0;
        }

        const newSupply = new Supply({
            name,
            type,
            bulkPrice: bPrice,
            shippingFee: sFee,
            totalWeight: tWeight,
            quantity: qty,
            originalWeight: tWeight, // Save the starting batch size
            originalQuantity: qty,   // Save the starting batch size
            unitCost                 // Lock in the unit price
        });
        
        const savedSupply = await newSupply.save();
        res.status(201).json(savedSupply);
    } catch (error) {
        console.error("CREATE SUPPLY ERROR:", error);
        res.status(400).json({ message: error.message });
    }
};

// Update a supply
exports.updateSupply = async (req, res) => {
    try {
        const supply = await Supply.findById(req.params.id);
        if (!supply) {
            return res.status(404).json({ message: "Supply not found" });
        }

        // Apply incoming updates EXCEPT for protected fields to guarantee price lock
        const { unitCost, originalWeight, originalQuantity, ...allowedUpdates } = req.body;
        Object.assign(supply, allowedUpdates);

        // NOTE: We no longer recalculate unitCost here. If a user is updating the stock
        // (a deduction), the original unit price must remain mathematically isolated and locked.

        const updatedSupply = await supply.save();
        res.json(updatedSupply);
    } catch (error) {
        console.error("UPDATE SUPPLY ERROR:", error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a supply
exports.deleteSupply = async (req, res) => {
    try {
        await Supply.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supply deleted successfully' });
    } catch (error) {
        console.error("DELETE SUPPLY ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};
