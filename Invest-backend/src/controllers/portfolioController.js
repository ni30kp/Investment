const supabase = require('../utils/supabase');

// Get portfolio data
const getPortfolio = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('portfolios')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get sector allocation
const getSectorAllocation = async (req, res) => {
    try {
        // In a real application, this would fetch actual sector allocation data
        // For this demo, we'll return mock data
        const mockSectorData = [
            { name: 'Financial', value: 195000, percentage: 34 },
            { name: 'Healthcare', value: 83250, percentage: 14.5 },
            { name: 'Technology', value: 111000, percentage: 19 },
            { name: 'Consumer Goods', value: 55500, percentage: 9.5 },
            { name: 'Energy', value: 55500, percentage: 9.5 },
            { name: 'Other Sectors', value: 55500, percentage: 9.5 }
        ];

        return res.status(200).json(mockSectorData);
    } catch (error) {
        console.error('Error fetching sector allocation:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get portfolio performance
const getPerformance = async (req, res) => {
    try {
        console.log('Portfolio performance request received');

        // Get query parameters
        const { period = '1M', interval = 'daily' } = req.query;
        console.log(`Period: ${period}, Interval: ${interval}`);

        // Calculate date range based on period
        const endDate = new Date();
        let startDate = new Date();

        switch (period) {
            case '1M':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case '3M':
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            case '6M':
                startDate.setMonth(endDate.getMonth() - 6);
                break;
            case '1Y':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            case '3Y':
                startDate.setFullYear(endDate.getFullYear() - 3);
                break;
            case 'MAX':
                startDate = new Date(2023, 0, 1); // Start from Jan 2023
                break;
            default:
                startDate.setMonth(endDate.getMonth() - 1);
        }

        // Format dates for display
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        console.log(`Date range: ${startDateStr} to ${endDateStr}`);

        // Generate sample performance data
        const performanceData = generatePerformanceData(startDate, endDate, interval);

        return res.status(200).json({
            period,
            interval,
            data: performanceData
        });
    } catch (error) {
        console.error('Error fetching portfolio performance:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Helper function to generate sample performance data
function generatePerformanceData(startDate, endDate, interval) {
    const data = [];
    const dayMillis = 24 * 60 * 60 * 1000;
    const baseValue = 500000; // Starting portfolio value

    let currentDate = new Date(startDate);
    let currentValue = baseValue;

    // Determine step size based on interval
    let stepDays = 1;
    if (interval === 'monthly') {
        stepDays = 30;
    } else if (interval === 'yearly') {
        stepDays = 365;
    }

    while (currentDate <= endDate) {
        // Add some random fluctuation to simulate market movement
        const changePercent = (Math.random() * 2 - 1) * 0.5; // Random between -0.5% and +0.5%
        currentValue = currentValue * (1 + changePercent / 100);

        data.push({
            date: currentDate.toISOString().split('T')[0],
            value: Math.round(currentValue),
            changePercentage: changePercent
        });

        // Move to next date
        currentDate = new Date(currentDate.getTime() + stepDays * dayMillis);
    }

    return data;
}

module.exports = {
    getPortfolio,
    getSectorAllocation,
    getPerformance
}; 