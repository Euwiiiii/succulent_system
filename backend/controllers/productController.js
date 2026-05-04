const Product = require('../models/Product');
const { calculateFinalPrices } = require('../utils/calculator');
const Supply = require('../models/Supply');
const Sale = require('../models/Sale'); // For Sales tracking

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
    try {
        const { name, type, plants, pot, potCost, supplies, laborCost, markupPercentage, stockQuantity, imageUrl, costPrice, sellingPrice } = req.body;
        const { totalCost, sellingPrice: finalSellingPrice } = calculateFinalPrices(req.body);

        const qtyToAdd = Number(stockQuantity) || 0;

        // --- VALIDATION: Check if enough supplies are available before saving ---
        if (qtyToAdd > 0) {
            if (pot) {
                const potId = pot?.supply?._id || pot?._id || pot;
                const potSupply = await Supply.findById(potId);
                if (!potSupply || potSupply.quantity < qtyToAdd) {
                    return res.status(400).json({ message: `Insufficient supply: Only ${potSupply?.quantity || 0} ${potSupply?.name || 'Pot'} available.` });
                }
            }
            if (Array.isArray(supplies)) {
                for (const item of supplies) {
                    const supplyId = item.supply?._id || item.supply;
                    const gramsNeeded = (Number(item.gramsUsed) || 0) * qtyToAdd;
                    if (supplyId && gramsNeeded > 0) {
                        const s = await Supply.findById(supplyId);
                        if (!s || s.totalWeight < gramsNeeded) {
                            return res.status(400).json({ message: `Insufficient supply: Only ${s?.totalWeight || 0}g of ${s?.name || 'Soil/Fertilizer'} available.` });
                        }
                    }
                }
            }
        }
        // ------------------------------------------------------------------------

        const newProduct = new Product({
            name, type, plants,
            pot: pot?.supply?._id || pot?._id || pot || null,
            potCost: Number(potCost) || 0,
            supplies: Array.isArray(supplies) ? supplies.map(s => ({
                supply: s.supply?._id || s.supply,
                gramsUsed: Number(s.gramsUsed) || 0
            })) : [],
            laborCost: Number(laborCost) || 0,
            markupPercentage: Number(markupPercentage) || 0,
            totalCost,
            sellingPrice: finalSellingPrice,
            stockQuantity: qtyToAdd,
            imageUrl
        });

        const savedProduct = await newProduct.save();

        // --- AUTOMATIC DEDUCTION LOGIC ---
        if (qtyToAdd > 0) {
            if (savedProduct.pot) {
                await Supply.findByIdAndUpdate(savedProduct.pot, { $inc: { quantity: -qtyToAdd } });
            }
            if (savedProduct.supplies && savedProduct.supplies.length > 0) {
                for (const item of savedProduct.supplies) {
                    if (item.supply && item.gramsUsed > 0) {
                        await Supply.findByIdAndUpdate(item.supply, { $inc: { totalWeight: -(item.gramsUsed * qtyToAdd) } });
                    }
                }
            }
        }
        // ---------------------------------

        res.status(201).json(savedProduct);

    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found in database." });
        }

        const { name, type, plants, pot, potCost, supplies, laborCost, markupPercentage, stockQuantity, imageUrl, costPrice, sellingPrice, totalCost } = req.body;
        
        const oldStock = existingProduct.stockQuantity;
        const newStock = Number(stockQuantity) || 0;
        const delta = newStock - oldStock;

        // --- VALIDATION FOR ASSEMBLY (INCREASING STOCK) ---
        if (delta > 0) {
            if (pot) {
                const potId = pot?.supply?._id || pot?._id || pot;
                const potSupply = await Supply.findById(potId);
                if (!potSupply || potSupply.quantity < delta) {
                    return res.status(400).json({ message: `Insufficient supply for assembly: Only ${potSupply?.quantity || 0} ${potSupply?.name || 'Pot'} available for ${delta} additional items.` });
                }
            }
            if (Array.isArray(supplies)) {
                for (const item of supplies) {
                    const supplyId = item.supply?._id || item.supply;
                    const gramsNeeded = (Number(item.gramsUsed) || 0) * delta;
                    if (supplyId && gramsNeeded > 0) {
                        const s = await Supply.findById(supplyId);
                        if (!s || s.totalWeight < gramsNeeded) {
                            return res.status(400).json({ message: `Insufficient supply for assembly: Only ${s?.totalWeight || 0}g of ${s?.name || 'Soil/Fertilizer'} available for ${gramsNeeded}g needed.` });
                        }
                    }
                }
            }
        }
        // ----------------------------------------------------

        const sanitizedPlants = Array.isArray(plants) ? plants.map(plant => ({
            name: plant.name || 'Unnamed Plant',
            cost: Number(plant.cost) || 0
        })) : [];

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
            stockQuantity: newStock,
            imageUrl: imageUrl || ''
        };

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        // --- MRP & SALES TRACKING EXECUTION ---
        if (delta > 0) {
            // Assembly: Deduct materials for the delta
            if (updatedProduct.pot) {
                await Supply.findByIdAndUpdate(updatedProduct.pot, { $inc: { quantity: -delta } });
            }
            if (updatedProduct.supplies && updatedProduct.supplies.length > 0) {
                for (const item of updatedProduct.supplies) {
                    if (item.supply && item.gramsUsed > 0) {
                        await Supply.findByIdAndUpdate(item.supply, { $inc: { totalWeight: -(item.gramsUsed * delta) } });
                    }
                }
            }
        } else if (delta < 0) {
            // Sale: Track it, do NOT restock supplies
            const qtySold = Math.abs(delta);
            const sale = new Sale({
                productName: updatedProduct.name,
                quantitySold: qtySold,
                totalRevenue: updatedProduct.sellingPrice * qtySold
            });
            await sale.save();
        }
        // --------------------------------------

        res.json(updatedProduct);

    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);
        res.status(400).json({ message: error.message });
    }
};