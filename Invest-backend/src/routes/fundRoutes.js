const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fundController');

// GET /api/funds
router.get('/', fundController.getFunds);

// GET /api/funds/overlap
router.get('/overlap', fundController.getFundOverlap);

module.exports = router; 