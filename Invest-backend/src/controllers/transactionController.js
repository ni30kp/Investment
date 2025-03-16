const supabase = require('../utils/supabase');

// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('investments')
            .select(`
        *,
        funds:fund_id (name, type, amc, nav)
      `)
            .order('purchase_date', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getTransactions
}; 