const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route GET /api/funds
 * @description Get all mutual funds
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all mutual funds...');

        const { data, error } = await supabase
            .from('mutual_funds')
            .select('*')
            .order('fund_name');

        if (error) {
            console.error('Error fetching mutual funds:', error);
            throw error;
        }

        console.log(`Successfully fetched ${data.length} mutual funds`);
        res.json(data);
    } catch (error) {
        console.error('Error fetching funds:', error);
        res.status(500).json({ error: 'Failed to fetch funds data' });
    }
});

/**
 * @route GET /api/funds/:id
 * @description Get a specific mutual fund by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
    try {
        const fundId = req.params.id;

        // Get fund details
        const { data: fund, error: fundError } = await supabase
            .from('mutual_funds')
            .select('*')
            .eq('fund_id', fundId)
            .single();

        if (fundError) {
            throw fundError;
        }

        if (!fund) {
            return res.status(404).json({ error: 'Fund not found' });
        }

        // Get sector allocations
        const { data: sectorAllocations, error: sectorError } = await supabase
            .from('fund_sector_allocations')
            .select(`
        allocation_percentage,
        sectors (
          sector_id,
          sector_name
        )
      `)
            .eq('fund_id', fundId);

        if (sectorError) {
            throw sectorError;
        }

        // Get stock allocations
        const { data: stockAllocations, error: stockError } = await supabase
            .from('fund_stock_allocations')
            .select(`
        allocation_percentage,
        stocks (
          stock_id,
          stock_name,
          ticker
        )
      `)
            .eq('fund_id', fundId);

        if (stockError) {
            throw stockError;
        }

        // Get market cap allocations
        const { data: marketCapAllocations, error: marketCapError } = await supabase
            .from('fund_market_cap_allocations')
            .select(`
        allocation_percentage,
        market_caps (
          market_cap_id,
          cap_category
        )
      `)
            .eq('fund_id', fundId);

        if (marketCapError) {
            throw marketCapError;
        }

        // Format the response
        const formattedFund = {
            ...fund,
            sectors: sectorAllocations.map(sa => ({
                sectorId: sa.sectors.sector_id,
                sectorName: sa.sectors.sector_name,
                percentage: parseFloat(sa.allocation_percentage)
            })),
            stocks: stockAllocations.map(sa => ({
                stockId: sa.stocks.stock_id,
                stockName: sa.stocks.stock_name,
                ticker: sa.stocks.ticker,
                percentage: parseFloat(sa.allocation_percentage)
            })),
            marketCaps: marketCapAllocations.map(ma => ({
                marketCapId: ma.market_caps.market_cap_id,
                category: ma.market_caps.cap_category,
                percentage: parseFloat(ma.allocation_percentage)
            }))
        };

        res.json(formattedFund);
    } catch (error) {
        console.error('Error fetching fund details:', error);
        res.status(500).json({ error: 'Failed to fetch fund details' });
    }
});

/**
 * @route GET /api/funds/:id/performance
 * @description Get performance data for a specific fund
 * @access Public
 */
router.get('/:id/performance', async (req, res) => {
    try {
        const fundId = req.params.id;

        // Get query parameters
        const { interval = 'daily', period = '1M' } = req.query;

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

        // Get performance data
        const { data, error } = await supabase
            .from('fund_history')
            .select('value_date, nav, daily_change_percentage')
            .eq('fund_id', fundId)
            .gte('value_date', startDateStr)
            .lte('value_date', endDateStr)
            .order('value_date');

        if (error) {
            throw error;
        }

        let performanceData = data;

        if (interval === 'monthly') {
            // Group by month
            const monthlyMap = new Map();

            data.forEach(item => {
                const monthKey = item.value_date.substring(0, 7); // YYYY-MM
                if (!monthlyMap.has(monthKey) || new Date(monthlyMap.get(monthKey).value_date) < new Date(item.value_date)) {
                    monthlyMap.set(monthKey, item);
                }
            });

            performanceData = Array.from(monthlyMap.values()).sort((a, b) =>
                new Date(a.value_date) - new Date(b.value_date)
            );
        } else if (interval === 'yearly') {
            // Group by year
            const yearlyMap = new Map();

            data.forEach(item => {
                const yearKey = item.value_date.substring(0, 4); // YYYY
                if (!yearlyMap.has(yearKey) || new Date(yearlyMap.get(yearKey).value_date) < new Date(item.value_date)) {
                    yearlyMap.set(yearKey, item);
                }
            });

            performanceData = Array.from(yearlyMap.values()).sort((a, b) =>
                new Date(a.value_date) - new Date(b.value_date)
            );
        }

        // Format the response
        const formattedData = performanceData.map(item => ({
            date: item.value_date,
            nav: parseFloat(item.nav),
            changePercentage: parseFloat(item.daily_change_percentage)
        }));

        // Get fund details
        const { data: fund, error: fundError } = await supabase
            .from('mutual_funds')
            .select('fund_name, fund_type, risk_level, expense_ratio, aum')
            .eq('fund_id', fundId)
            .single();

        if (fundError) {
            throw fundError;
        }

        res.json({
            fundId,
            fundName: fund.fund_name,
            fundType: fund.fund_type,
            riskLevel: fund.risk_level,
            expenseRatio: fund.expense_ratio,
            aum: fund.aum,
            period,
            interval,
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching fund performance:', error);
        res.status(500).json({ error: 'Failed to fetch fund performance data' });
    }
});

/**
 * @route GET /api/funds/:id/compare/:compareId
 * @description Compare two funds
 * @access Public
 */
router.get('/:id/compare/:compareId', async (req, res) => {
    try {
        const fundId = req.params.id;
        const compareId = req.params.compareId;

        // Get both funds' details
        const { data: funds, error: fundsError } = await supabase
            .from('mutual_funds')
            .select('fund_id, fund_name, fund_type, risk_level, expense_ratio, aum, nav')
            .in('fund_id', [fundId, compareId]);

        if (fundsError) {
            throw fundsError;
        }

        if (funds.length !== 2) {
            return res.status(404).json({ error: 'One or both funds not found' });
        }

        // Get performance data for both funds (last year)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const startDateStr = oneYearAgo.toISOString().split('T')[0];
        const endDateStr = new Date().toISOString().split('T')[0];

        const { data: performanceData, error: perfError } = await supabase
            .from('fund_history')
            .select('fund_id, value_date, nav, daily_change_percentage')
            .in('fund_id', [fundId, compareId])
            .gte('value_date', startDateStr)
            .lte('value_date', endDateStr)
            .order('value_date');

        if (perfError) {
            throw perfError;
        }

        // Get fund overlaps
        const { data: overlaps, error: overlapError } = await supabase
            .from('fund_overlaps')
            .select('overlap_percentage')
            .or(`(fund_id1.eq.${fundId}.and.fund_id2.eq.${compareId}),(fund_id1.eq.${compareId}.and.fund_id2.eq.${fundId})`)
            .single();

        if (overlapError && overlapError.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows"
            throw overlapError;
        }

        // Get sector allocations for both funds
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
            .in('fund_id', [fundId, compareId]);

        if (sectorError) {
            throw sectorError;
        }

        // Group performance data by fund
        const fund1Performance = performanceData.filter(p => p.fund_id === parseInt(fundId));
        const fund2Performance = performanceData.filter(p => p.fund_id === parseInt(compareId));

        // Group sector allocations by fund
        const fund1Sectors = sectorAllocations.filter(s => s.fund_id === parseInt(fundId));
        const fund2Sectors = sectorAllocations.filter(s => s.fund_id === parseInt(compareId));

        // Format sector data for comparison
        const sectorComparisonMap = new Map();

        // Add fund1 sectors
        fund1Sectors.forEach(s => {
            sectorComparisonMap.set(s.sectors.sector_name, {
                sectorName: s.sectors.sector_name,
                fund1Percentage: parseFloat(s.allocation_percentage),
                fund2Percentage: 0
            });
        });

        // Add or update fund2 sectors
        fund2Sectors.forEach(s => {
            const sectorName = s.sectors.sector_name;
            if (sectorComparisonMap.has(sectorName)) {
                const existing = sectorComparisonMap.get(sectorName);
                existing.fund2Percentage = parseFloat(s.allocation_percentage);
                sectorComparisonMap.set(sectorName, existing);
            } else {
                sectorComparisonMap.set(sectorName, {
                    sectorName,
                    fund1Percentage: 0,
                    fund2Percentage: parseFloat(s.allocation_percentage)
                });
            }
        });

        // Format the response
        const fund1 = funds.find(f => f.fund_id === parseInt(fundId));
        const fund2 = funds.find(f => f.fund_id === parseInt(compareId));

        res.json({
            fund1: {
                fundId: fund1.fund_id,
                fundName: fund1.fund_name,
                fundType: fund1.fund_type,
                riskLevel: fund1.risk_level,
                expenseRatio: parseFloat(fund1.expense_ratio),
                aum: parseFloat(fund1.aum),
                currentNav: parseFloat(fund1.nav),
                performance: fund1Performance.map(p => ({
                    date: p.value_date,
                    nav: parseFloat(p.nav),
                    changePercentage: parseFloat(p.daily_change_percentage)
                }))
            },
            fund2: {
                fundId: fund2.fund_id,
                fundName: fund2.fund_name,
                fundType: fund2.fund_type,
                riskLevel: fund2.risk_level,
                expenseRatio: parseFloat(fund2.expense_ratio),
                aum: parseFloat(fund2.aum),
                currentNav: parseFloat(fund2.nav),
                performance: fund2Performance.map(p => ({
                    date: p.value_date,
                    nav: parseFloat(p.nav),
                    changePercentage: parseFloat(p.daily_change_percentage)
                }))
            },
            overlap: overlaps ? parseFloat(overlaps.overlap_percentage) : 0,
            sectorComparison: Array.from(sectorComparisonMap.values())
        });
    } catch (error) {
        console.error('Error comparing funds:', error);
        res.status(500).json({ error: 'Failed to compare funds' });
    }
});

module.exports = router; 