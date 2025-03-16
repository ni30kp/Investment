const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route GET /api/portfolio
 * @description Get user's portfolio summary
 * @access Private
 */
router.get('/', async (req, res) => {
    try {
        // In a real app, you would get the user_id from the authenticated session
        // For demo purposes, we'll use user_id 3 (Nitish Kumar)
        const userId = 3;

        // Get user's investments with mutual fund details
        const { data: investments, error: investmentsError } = await supabase
            .from('user_investments')
            .select(`
                investment_id,
                amount_invested,
                returns_since_investment,
                fund_id,
                mutual_funds (
                    fund_id,
                    fund_name,
                    nav,
                    fund_type,
                    risk_level,
                    isin
                )
            `)
            .eq('user_id', userId);

        if (investmentsError) {
            console.error('Error fetching investments:', investmentsError);
            return res.status(500).json({ error: 'Failed to fetch investment data', details: investmentsError.message });
        }

        if (!investments || investments.length === 0) {
            return res.status(404).json({ error: 'No investments found for this user' });
        }

        // Calculate portfolio summary
        const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount_invested), 0);
        const totalReturns = investments.reduce((sum, inv) => {
            const returnAmount = parseFloat(inv.amount_invested) * (parseFloat(inv.returns_since_investment) / 100);
            return sum + returnAmount;
        }, 0);
        const totalValue = totalInvested + totalReturns;

        // Format the response
        const portfolioSummary = {
            totalValue,
            totalInvested,
            totalReturns,
            percentageGain: totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0,
            investments: investments.map(inv => ({
                investmentId: inv.investment_id,
                fundId: inv.mutual_funds.fund_id,
                fundName: inv.mutual_funds.fund_name,
                amountInvested: parseFloat(inv.amount_invested),
                currentValue: parseFloat(inv.amount_invested) * (1 + parseFloat(inv.returns_since_investment) / 100),
                returns: parseFloat(inv.returns_since_investment),
                fundType: inv.mutual_funds.fund_type,
                riskLevel: inv.mutual_funds.risk_level,
                isin: inv.mutual_funds.isin
            }))
        };

        res.json(portfolioSummary);
    } catch (error) {
        console.error('Error in portfolio route:', error);
        res.status(500).json({
            error: 'Failed to fetch portfolio data',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * @route GET /api/portfolio/performance
 * @description Get user's portfolio performance data
 * @access Private
 */
router.get('/performance', async (req, res) => {
    try {
        // In a real app, you would get the user_id from the authenticated session
        // For demo purposes, we'll use user_id 3 (Nitish Kumar)
        const userId = 3;

        // Get query parameters
        const { interval = 'daily', period = '1M' } = req.query;

        console.log(`Portfolio performance request: userId=${userId}, period=${period}, interval=${interval}`);

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

        // Format dates for SQL
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        console.log(`Fetching performance data for user ${userId} from ${startDateStr} to ${endDateStr} with interval ${interval}`);

        // Get performance data
        let performanceData;

        if (interval === 'daily') {
            // Get daily data for the current month
            const { data: dailyData, error: dailyError } = await supabase
                .from('portfolio_daily')
                .select('value_date, total_value, daily_change_percentage')
                .eq('user_id', userId)
                .gte('value_date', startDateStr)
                .lte('value_date', endDateStr)
                .order('value_date');

            if (dailyError) {
                console.error('Error fetching daily data:', dailyError);
                throw dailyError;
            }

            console.log(`Found ${dailyData ? dailyData.length : 0} daily data points`);

            // If we need data beyond what's in portfolio_daily, get it from portfolio_history
            if (!dailyData || dailyData.length === 0 || new Date(dailyData[0].value_date) > startDate) {
                console.log('Fetching additional data from portfolio_history');
                const { data: monthlyData, error: monthlyError } = await supabase
                    .from('portfolio_history')
                    .select('value_date, total_value, daily_change_percentage')
                    .eq('user_id', userId)
                    .gte('value_date', startDateStr)
                    .lte('value_date', endDateStr)
                    .order('value_date');

                if (monthlyError) {
                    console.error('Error fetching monthly data:', monthlyError);
                    throw monthlyError;
                }

                console.log(`Found ${monthlyData ? monthlyData.length : 0} monthly data points`);

                // Combine daily and monthly data, avoiding duplicates
                if (dailyData && dailyData.length > 0) {
                    const dailyDates = new Set(dailyData.map(d => d.value_date));
                    const filteredMonthlyData = monthlyData.filter(d => !dailyDates.has(d.value_date));
                    performanceData = [...filteredMonthlyData, ...dailyData].sort((a, b) =>
                        new Date(a.value_date) - new Date(b.value_date)
                    );
                } else {
                    performanceData = monthlyData || [];
                }
            } else {
                performanceData = dailyData || [];
            }
        } else {
            // Get monthly or yearly data
            console.log('Fetching data from portfolio_history for monthly/yearly interval');
            const { data, error } = await supabase
                .from('portfolio_history')
                .select('value_date, total_value, daily_change_percentage')
                .eq('user_id', userId)
                .gte('value_date', startDateStr)
                .lte('value_date', endDateStr)
                .order('value_date');

            if (error) {
                console.error('Error fetching history data:', error);
                throw error;
            }

            console.log(`Found ${data ? data.length : 0} history data points`);

            if (interval === 'monthly') {
                // Group by month
                const monthlyMap = new Map();

                if (data && data.length > 0) {
                    data.forEach(item => {
                        const monthKey = item.value_date.substring(0, 7); // YYYY-MM
                        if (!monthlyMap.has(monthKey) || new Date(monthlyMap.get(monthKey).value_date) < new Date(item.value_date)) {
                            monthlyMap.set(monthKey, item);
                        }
                    });

                    performanceData = Array.from(monthlyMap.values()).sort((a, b) =>
                        new Date(a.value_date) - new Date(b.value_date)
                    );
                } else {
                    performanceData = [];
                }
            } else if (interval === 'yearly') {
                // Group by year
                const yearlyMap = new Map();

                if (data && data.length > 0) {
                    data.forEach(item => {
                        const yearKey = item.value_date.substring(0, 4); // YYYY
                        if (!yearlyMap.has(yearKey) || new Date(yearlyMap.get(yearKey).value_date) < new Date(item.value_date)) {
                            yearlyMap.set(yearKey, item);
                        }
                    });

                    performanceData = Array.from(yearlyMap.values()).sort((a, b) =>
                        new Date(a.value_date) - new Date(b.value_date)
                    );
                } else {
                    performanceData = [];
                }
            } else {
                performanceData = data || [];
            }
        }

        // If no data found, generate some sample data
        if (!performanceData || performanceData.length === 0) {
            console.log('No performance data found, generating sample data');
            performanceData = generateSamplePerformanceData(startDate, endDate, interval);
        }

        // Format the response
        const formattedData = performanceData.map(item => ({
            date: item.value_date,
            value: parseFloat(item.total_value),
            changePercentage: parseFloat(item.daily_change_percentage)
        }));

        console.log(`Returning ${formattedData.length} formatted data points`);

        res.json({
            userId,
            period,
            interval,
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching performance data:', error);
        res.status(500).json({ error: 'Failed to fetch performance data' });
    }
});

// Helper function to generate sample performance data if none exists
function generateSamplePerformanceData(startDate, endDate, interval) {
    const data = [];
    const baseValue = 350000;
    const dayMillis = 24 * 60 * 60 * 1000;

    if (interval === 'daily') {
        // Generate daily data points
        for (let date = new Date(startDate); date <= endDate; date = new Date(date.getTime() + dayMillis)) {
            const daysSinceStart = Math.floor((date - startDate) / dayMillis);
            const fluctuation = Math.sin(daysSinceStart / 5) * 5000;
            const value = baseValue + fluctuation + (daysSinceStart * 100);
            const change = (Math.sin(daysSinceStart / 5) * 0.5).toFixed(2);

            data.push({
                value_date: date.toISOString().split('T')[0],
                total_value: value.toFixed(2),
                daily_change_percentage: change
            });
        }
    } else if (interval === 'monthly') {
        // Generate monthly data points
        const months = Math.ceil((endDate - startDate) / (30 * dayMillis));
        for (let i = 0; i < months; i++) {
            const date = new Date(startDate);
            date.setMonth(date.getMonth() + i);

            const value = baseValue + (i * 5000) + (Math.random() * 2000 - 1000);
            const change = (Math.random() * 2 - 0.5).toFixed(2);

            data.push({
                value_date: date.toISOString().split('T')[0],
                total_value: value.toFixed(2),
                daily_change_percentage: change
            });
        }
    } else {
        // Generate yearly data points
        const years = Math.ceil((endDate - startDate) / (365 * dayMillis));
        for (let i = 0; i < years; i++) {
            const date = new Date(startDate);
            date.setFullYear(date.getFullYear() + i);

            const value = baseValue + (i * 20000) + (Math.random() * 5000 - 2500);
            const change = (Math.random() * 10 - 2).toFixed(2);

            data.push({
                value_date: date.toISOString().split('T')[0],
                total_value: value.toFixed(2),
                daily_change_percentage: change
            });
        }
    }

    return data;
}

/**
 * @route GET /api/portfolio/sectors
 * @description Get user's portfolio sector allocation
 * @access Private
 */
router.get('/sectors', async (req, res) => {
    try {
        // In a real app, you would get the user_id from the authenticated session
        // For demo purposes, we'll use user_id 3 (Nitish Kumar)
        const userId = 3;

        // Get user's investments with fund details
        const { data: investments, error: investmentsError } = await supabase
            .from('user_investments')
            .select(`
        investment_id,
        amount_invested,
        returns_since_investment,
        fund_id,
        mutual_funds (
          fund_id,
          fund_name
        )
      `)
            .eq('user_id', userId);

        if (investmentsError) {
            throw investmentsError;
        }

        // Get sector allocations for each fund
        const fundIds = investments.map(inv => inv.fund_id);
        const { data: sectorAllocations, error: sectorError } = await supabase
            .from('fund_sector_allocations')
            .select(`
        fund_id,
        allocation_percentage,
        sectors (
          sector_id,
          sector_name
        )
      `)
            .in('fund_id', fundIds);

        if (sectorError) {
            throw sectorError;
        }

        // Calculate current value of each investment
        const investmentValues = investments.map(inv => {
            const currentValue = parseFloat(inv.amount_invested) * (1 + parseFloat(inv.returns_since_investment) / 100);
            return {
                fundId: inv.fund_id,
                fundName: inv.mutual_funds.fund_name,
                currentValue
            };
        });

        // Calculate total portfolio value
        const totalPortfolioValue = investmentValues.reduce((sum, inv) => sum + inv.currentValue, 0);

        // Calculate sector allocation
        const sectorMap = new Map();

        // For each investment, calculate its contribution to each sector
        investmentValues.forEach(investment => {
            // Get sector allocations for this fund
            const fundSectors = sectorAllocations.filter(sa => sa.fund_id === investment.fundId);

            // For each sector allocation, calculate the value
            fundSectors.forEach(sa => {
                const sectorValue = investment.currentValue * (parseFloat(sa.allocation_percentage) / 100);
                const sectorName = sa.sectors.sector_name;

                if (sectorMap.has(sectorName)) {
                    sectorMap.set(sectorName, sectorMap.get(sectorName) + sectorValue);
                } else {
                    sectorMap.set(sectorName, sectorValue);
                }
            });
        });

        // Convert to array and calculate percentages
        const sectorAllocation = Array.from(sectorMap.entries()).map(([sector, value]) => ({
            sector,
            value,
            percentage: (value / totalPortfolioValue) * 100
        }));

        // Sort by percentage (descending)
        sectorAllocation.sort((a, b) => b.percentage - a.percentage);

        res.json({
            totalValue: totalPortfolioValue,
            sectors: sectorAllocation
        });
    } catch (error) {
        console.error('Error fetching sector allocation:', error);
        res.status(500).json({ error: 'Failed to fetch sector allocation data' });
    }
});

module.exports = router; 