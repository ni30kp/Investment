const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route GET /api/investments/summary
 * @description Get investment summary statistics
 * @access Public
 */
router.get('/summary', async (req, res) => {
    try {
        console.log('Fetching investment summary...');

        // Get total number of users
        const { count: userCount, error: userError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (userError) {
            console.error('Error fetching user count:', userError);
            throw userError;
        }

        // Get total number of funds
        const { count: fundCount, error: fundError } = await supabase
            .from('mutual_funds')
            .select('*', { count: 'exact', head: true });

        if (fundError) {
            console.error('Error fetching fund count:', fundError);
            throw fundError;
        }

        // Get total AUM (Assets Under Management)
        const { data: funds, error: aumError } = await supabase
            .from('mutual_funds')
            .select('aum');

        if (aumError) {
            console.error('Error fetching AUM:', aumError);
            throw aumError;
        }

        const totalAUM = funds.reduce((sum, fund) => sum + parseFloat(fund.aum || 0), 0);

        // Get total investments - using user_investments table
        const { count: investmentCount, error: investmentError } = await supabase
            .from('user_investments')
            .select('*', { count: 'exact', head: true });

        if (investmentError) {
            console.error('Error fetching investment count:', investmentError);
            throw investmentError;
        }

        // Get total invested amount - using user_investments table
        const { data: investments, error: amountError } = await supabase
            .from('user_investments')
            .select('amount_invested');

        if (amountError) {
            console.error('Error fetching investment amounts:', amountError);
            throw amountError;
        }

        const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount_invested || 0), 0);

        // Get average returns - using user_investments table
        const { data: returnsData, error: returnsError } = await supabase
            .from('user_investments')
            .select('returns_since_investment');

        if (returnsError) {
            console.error('Error fetching returns data:', returnsError);
            throw returnsError;
        }

        const avgReturns = returnsData.length > 0
            ? returnsData.reduce((sum, inv) => sum + parseFloat(inv.returns_since_investment || 0), 0) / returnsData.length
            : 0;

        // Get top performing fund
        const { data: topFund, error: topFundError } = await supabase
            .from('mutual_funds')
            .select('fund_id, fund_name, nav')
            .order('nav', { ascending: false })
            .limit(1)
            .single();

        if (topFundError) {
            console.error('Error fetching top fund:', topFundError);
            throw topFundError;
        }

        console.log('Successfully fetched investment summary data');

        res.json({
            userCount,
            fundCount,
            totalAUM,
            investmentCount,
            totalInvested,
            avgReturns,
            topPerformingFund: topFund ? {
                id: topFund.fund_id,
                name: topFund.fund_name,
                nav: parseFloat(topFund.nav || 0)
            } : null,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching investment summary:', error);
        res.status(500).json({ error: 'Failed to fetch investment summary' });
    }
});

/**
 * @route GET /api/investments
 * @description Get all investments for a user
 * @access Private
 */
router.get('/', async (req, res) => {
    try {
        console.log('Fetching investments for user...');

        // In a real app, you would get the user_id from the authenticated session
        // For demo purposes, we'll use user_id 3 (Nitish Kumar)
        const userId = 3;

        // Get user's investments - using separate queries to avoid relationship issues
        const { data: investments, error: investmentsError } = await supabase
            .from('user_investments')
            .select('investment_id, user_id, fund_id, amount_invested, investment_date, returns_since_investment')
            .eq('user_id', userId);

        if (investmentsError) {
            console.error('Error fetching investments:', investmentsError);
            return res.status(500).json({ error: 'Failed to fetch investments' });
        }

        // Get fund details for each investment
        const fundIds = investments.map(inv => inv.fund_id);
        const { data: funds, error: fundsError } = await supabase
            .from('mutual_funds')
            .select('fund_id, fund_name, fund_type, risk_level, nav')
            .in('fund_id', fundIds);

        if (fundsError) {
            console.error('Error fetching fund details:', fundsError);
            return res.status(500).json({ error: 'Failed to fetch fund details' });
        }

        // Create a map of fund details for quick lookup
        const fundMap = {};
        funds.forEach(fund => {
            fundMap[fund.fund_id] = fund;
        });

        // Format the response
        const formattedInvestments = investments.map(inv => {
            const fund = fundMap[inv.fund_id] || {};
            return {
                id: inv.investment_id,
                userId: inv.user_id,
                fundId: inv.fund_id,
                fundName: fund.fund_name || 'Unknown Fund',
                fundType: fund.fund_type || 'Unknown',
                riskLevel: fund.risk_level || 'Unknown',
                amountInvested: parseFloat(inv.amount_invested || 0),
                investmentDate: inv.investment_date,
                currentValue: parseFloat(inv.amount_invested || 0) * (1 + parseFloat(inv.returns_since_investment || 0) / 100),
                returns: parseFloat(inv.returns_since_investment || 0),
                nav: parseFloat(fund.nav || 0)
            };
        });

        console.log(`Successfully fetched ${formattedInvestments.length} investments for user ${userId}`);

        res.json(formattedInvestments);
    } catch (error) {
        console.error('Error fetching investments:', error);
        res.status(500).json({ error: 'Failed to fetch investments' });
    }
});

module.exports = router; 