const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

// GET /api/investments
router.get('/', investmentController.getInvestments);

// GET /api/investments/summary
router.get('/summary', investmentController.getInvestmentSummary);

module.exports = router; 