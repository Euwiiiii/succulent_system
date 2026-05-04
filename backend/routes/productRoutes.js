const express = require('express');
const router = express.Router();

const { getProducts, createProduct, updateProduct, deleteProduct, quickSellProduct } = require('../controllers/productController');
const { requireAdmin } = require('../middleware/auth');

// GET all products
router.get('/', getProducts);

// POST a new product 
router.post('/', requireAdmin, createProduct);

// PUT (update) an existing product
router.put('/:id', requireAdmin, updateProduct);

// DELETE a product
router.delete('/:id', requireAdmin, deleteProduct);

// PATCH (quick sell)
router.patch('/:id/sell', requireAdmin, quickSellProduct);

module.exports = router;