require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const usersRoutes = require('./routes/users');
const fundsRoutes = require('./routes/funds');
const portfolioRoutes = require('./routes/portfolio');
const investmentsRoutes = require('./routes/investments');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/funds', fundsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/investments', investmentsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to InvestWelth API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            funds: '/api/funds',
            portfolio: '/api/portfolio',
            investments: '/api/investments'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app; 