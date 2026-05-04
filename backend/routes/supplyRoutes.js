const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');

router.get('/', supplyController.getSupplies);
router.post('/', supplyController.createSupply);
router.put('/:id', supplyController.updateSupply);
router.delete('/:id', supplyController.deleteSupply);

module.exports = router;
