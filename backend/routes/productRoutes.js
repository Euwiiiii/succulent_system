const express = require('express');
const router = express.Router();

const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// GET all products
router.get('/', getProducts);

// POST a new product 
router.post('/', createProduct);

// PUT (update) an existing product
router.put('/:id', updateProduct);

// DELETE a product
router.delete('/:id', deleteProduct);

module.exports = router;