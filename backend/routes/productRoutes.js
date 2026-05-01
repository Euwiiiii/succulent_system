const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products
router.get('/', productController.getProducts);

// POST a new product
router.post('/', productController.createProduct);

// PUT (update) an existing product
router.put('/:id', productController.updateProduct);

// DELETE a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;