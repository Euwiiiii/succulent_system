const Sale = require('../models/Sale');

// Get all sales
exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find().sort({ date: -1 }); // Newest first
        res.json(sales);
    } catch (error) {
        console.error("GET SALES ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};
