const Product = require('../models/Product');
const { calculateFinalPrices } = require('../utils/calculator');
const Supply = require('../models/Supply'); // Ensure we can query if needed, though we get costPerGram from frontend mostly, but it's safer to use the util

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('supplies.supply').populate('pot');
        res.json(products);
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// Add a new product 
exports.createProduct = async (req, res) => {
    console.log("INCOMING DATA FROM REACT:", req.body);

    try {
        // Extract the raw data sent from React
        const { name, type, plants, pot, potCost, supplies, laborCost, markupPercentage, stockQuantity, imageUrl, costPrice, sellingPrice } = req.body;

        // Use shared utility to calculate prices
        const { totalCost, sellingPrice: finalSellingPrice } = calculateFinalPrices(req.body);

        // Assemble the final verified product
        const newProduct = new Product({
            name,
            type,
            plants,
            pot: pot?.supply?._id || pot?._id || pot || null,
            potCost: Number(potCost) || 0,
            supplies: Array.isArray(supplies) ? supplies.map(s => ({
                supply: s.supply?._id || s.supply, // Handle populated or raw ID
                gramsUsed: Number(s.gramsUsed) || 0
            })) : [],
            laborCost: Number(laborCost) || 0,
            markupPercentage: Number(markupPercentage) || 0,
            totalCost,
            sellingPrice: finalSellingPrice,
            stockQuantity: Number(stockQuantity) || 0,
            imageUrl
        });

        // Save to MongoDB
        const savedProduct = await newProduct.save();

        // --- AUTOMATIC REFLECTION / DEDUCTION LOGIC ---
        const qtyToDeduct = savedProduct.stockQuantity > 0 ? savedProduct.stockQuantity : 1; // Default to 1 if 0

        // Deduct Pot Quantity
        if (savedProduct.pot) {
            await Supply.findByIdAndUpdate(savedProduct.pot, {
                $inc: { quantity: -qtyToDeduct }
            });
        }

        // Deduct Supplies (Soil/Fertilizer) Weight
        if (savedProduct.supplies && savedProduct.supplies.length > 0) {
            for (const item of savedProduct.supplies) {
                if (item.supply && item.gramsUsed > 0) {
                    await Supply.findByIdAndUpdate(item.supply, {
                        $inc: { totalWeight: -(item.gramsUsed * qtyToDeduct) }
                    });
                }
            }
        }
        // ----------------------------------------------

        res.status(201).json(savedProduct);

    } catch (error) {
        console.error(" CREATE PRODUCT ERROR:", error);
        res.status(400).json({ message: error.message });
    }
};

// Update product
// exports.updateProduct = async (req, res) => {
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedProduct);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("🔥 DELETE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    console.log("INCOMING UPDATE DATA:", req.body);
    try {
        const { name, type, plants, pot, potCost, supplies, laborCost, markupPercentage, stockQuantity, imageUrl, costPrice, sellingPrice, totalCost } = req.body;

        const sanitizedPlants = Array.isArray(plants) ? plants.map(plant => ({
            name: plant.name || 'Unnamed Plant',
            cost: Number(plant.cost) || 0
        })) : [];

        // Use shared utility to calculate prices
        const calculatedPrices = calculateFinalPrices({
            ...req.body,
            plants: sanitizedPlants
        });

        const updateData = {
            name: name || 'Unnamed Item',
            type: type || 'Arrangement',
            plants: sanitizedPlants,
            pot: pot?.supply?._id || pot?._id || pot || null,
            potCost: Number(potCost) || 0,
            supplies: Array.isArray(supplies) ? supplies.map(s => ({
                supply: s.supply?._id || s.supply,
                gramsUsed: Number(s.gramsUsed) || 0
            })) : [],
            laborCost: Number(laborCost) || 0,
            markupPercentage: Number(markupPercentage) || 0,
            totalCost: calculatedPrices.totalCost,
            sellingPrice: calculatedPrices.sellingPrice,
            stockQuantity: Number(stockQuantity) || 0,
            imageUrl: imageUrl || ''
        };

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found in database." });
        }
        res.json(updatedProduct);

    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);
        res.status(400).json({ message: error.message });
    }
};