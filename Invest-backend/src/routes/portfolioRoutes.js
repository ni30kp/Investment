const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// GET /api/portfolio
router.get('/', portfolioController.getPortfolio);

// GET /api/portfolio/sectors
router.get('/sectors', portfolioController.getSectorAllocation);

// GET /api/portfolio/performance
router.get('/performance', portfolioController.getPerformance);

module.exports = router; 