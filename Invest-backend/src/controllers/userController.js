const supabase = require('../utils/supabase');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUserProfile
}; 