const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', supplyController.getSupplies);
router.post('/', requireAdmin, supplyController.createSupply);
router.put('/:id', requireAdmin, supplyController.updateSupply);
router.delete('/:id', requireAdmin, supplyController.deleteSupply);

module.exports = router;
