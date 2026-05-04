const express = require('express');
const router = express.Router();

const { getProducts, createProduct, updateProduct, deleteProduct, quickSellProduct } = require('../controllers/productController');

// GET all products
router.get('/', getProducts);

// POST a new product 
router.post('/', createProduct);

// PUT (update) an existing product
router.put('/:id', updateProduct);

// DELETE a product
router.delete('/:id', deleteProduct);

// PATCH (quick sell)
router.patch('/:id/sell', quickSellProduct);

module.exports = router;