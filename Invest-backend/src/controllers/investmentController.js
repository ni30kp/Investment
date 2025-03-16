const supabase = require('../utils/supabase');

// Get all investments
const getInvestments = async (req, res) => {
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
            return res.status(400).json({ error: investmentsError.message });
        }

        // Get fund details for each investment
        const fundIds = investments.map(inv => inv.fund_id);
        const { data: funds, error: fundsError } = await supabase
            .from('mutual_funds')
            .select('fund_id, fund_name, fund_type, risk_level, nav')
            .in('fund_id', fundIds);

        if (fundsError) {
            console.error('Error fetching fund details:', fundsError);
            return res.status(400).json({ error: fundsError.message });
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

        return res.status(200).json(formattedInvestments);
    } catch (error) {
        console.error('Error fetching investments:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get investment summary
const getInvestmentSummary = async (req, res) => {
    try {
        console.log('Fetching investment summary...');

        // Get total number of users
        const { count: userCount, error: userError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (userError) {
            console.error('Error fetching user count:', userError);
            return res.status(400).json({ error: userError.message });
        }

        // Get total number of funds
        const { count: fundCount, error: fundError } = await supabase
            .from('mutual_funds')
            .select('*', { count: 'exact', head: true });

        if (fundError) {
            console.error('Error fetching fund count:', fundError);
            return res.status(400).json({ error: fundError.message });
        }

        // Calculate total AUM (Assets Under Management) from NAV values
        const { data: funds, error: navError } = await supabase
            .from('mutual_funds')
            .select('nav');

        if (navError) {
            console.error('Error fetching NAV data:', navError);
            return res.status(400).json({ error: navError.message });
        }

        // Use NAV as a proxy for AUM (in a real app, AUM would be calculated differently)
        const totalAUM = funds.reduce((sum, fund) => sum + parseFloat(fund.nav || 0) * 1000000, 0);

        // Get total investments - using user_investments table
        const { count: investmentCount, error: investmentError } = await supabase
            .from('user_investments')
            .select('*', { count: 'exact', head: true });

        if (investmentError) {
            console.error('Error fetching investment count:', investmentError);
            return res.status(400).json({ error: investmentError.message });
        }

        // Get total invested amount - using user_investments table
        const { data: investments, error: amountError } = await supabase
            .from('user_investments')
            .select('amount_invested');

        if (amountError) {
            console.error('Error fetching investment amounts:', amountError);
            return res.status(400).json({ error: amountError.message });
        }

        const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount_invested || 0), 0);

        // Get average returns - using user_investments table
        const { data: returnsData, error: returnsError } = await supabase
            .from('user_investments')
            .select('returns_since_investment');

        if (returnsError) {
            console.error('Error fetching returns data:', returnsError);
            return res.status(400).json({ error: returnsError.message });
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
            return res.status(400).json({ error: topFundError.message });
        }

        const summary = {
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
        };

        console.log('Successfully fetched investment summary data');

        return res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching investment summary:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getInvestments,
    getInvestmentSummary
}; 