const Supply = require('../models/Supply');

// Get all supplies
exports.getSupplies = async (req, res) => {
    try {
        const supplies = await Supply.find();
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
        const newSupply = new Supply({
            name,
            type,
            bulkPrice: Number(bulkPrice) || 0,
            shippingFee: Number(shippingFee) || 0,
            totalWeight: Number(totalWeight) || 0,
            quantity: Number(quantity) || 0
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
        const updatedSupply = await Supply.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSupply) {
            return res.status(404).json({ message: "Supply not found" });
        }
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
