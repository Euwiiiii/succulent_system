const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
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
        const { name, type, plants, potCost, soilCost, laborCost, markupPercentage, stockQuantity, imageUrl } = req.body;

        // Perform the Math on the Backend (Security Best Practice)
        // Add up all plants in the array
        const totalPlantsCost = plants ? plants.reduce((sum, plant) => sum + (Number(plant.cost) || 0), 0) : 0;
        
        // Convert incoming strings to strict numbers
        const pot = Number(potCost) || 0;
        const soil = Number(soilCost) || 0;
        const labor = Number(laborCost) || 0;
        const markup = Number(markupPercentage) || 0;

        // Calculate Final Prices
        const totalCost = totalPlantsCost + pot + soil + labor;
        const profitAmount = totalCost * (markup / 100);
        const sellingPrice = totalCost + profitAmount;

        // Assemble the final verified product
        const newProduct = new Product({
            name,
            type,
            plants,
            potCost: pot,
            soilCost: soil,
            laborCost: labor,
            markupPercentage: markup,
            totalCost,
            sellingPrice,
            stockQuantity: Number(stockQuantity) || 0,
            imageUrl
        });

        // Save to MongoDB
        const savedProduct = await newProduct.save();
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
        const { name, type, plants, potCost, soilCost, laborCost, markupPercentage, stockQuantity, imageUrl, costPrice, sellingPrice, totalCost } = req.body;

        
        const sanitizedPlants = Array.isArray(plants) ? plants.map(plant => ({
            name: plant.name || 'Unnamed Plant',
            cost: Number(plant.cost) || 0 
        })) : [];

        const totalPlantsCost = sanitizedPlants.reduce((sum, plant) => sum + plant.cost, 0);
        
        const pot = Number(potCost) || 0;
        const soil = Number(soilCost) || 0;
        const labor = Number(laborCost) || 0;
        const markup = Number(markupPercentage) || 0;

        let finalTotalCost = 0;
        let finalSellingPrice = 0;
        
        // for the add product and calculator computation
        if (sanitizedPlants.length > 0 || pot > 0 || soil > 0) {
            finalTotalCost = totalPlantsCost + pot + soil + labor;
            finalSellingPrice = finalTotalCost + (finalTotalCost * (markup / 100));
        } else {
            finalTotalCost = Number(totalCost) || Number(costPrice) || 0;
            finalSellingPrice = Number(sellingPrice) || 0;
        }

        const updateData = {
            name: name || 'Unnamed Item', 
            type: type || 'Arrangement',
            plants: sanitizedPlants, 
            potCost: pot,
            soilCost: soil,
            laborCost: labor,
            markupPercentage: markup,
            totalCost: finalTotalCost,
            sellingPrice: finalSellingPrice,
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