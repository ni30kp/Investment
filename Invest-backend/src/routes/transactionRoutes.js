const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions
router.get('/', transactionController.getTransactions);

module.exports = router; 