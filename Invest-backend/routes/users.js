const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route GET /api/users/profile
 * @description Get user profile
 * @access Private
 */
router.get('/profile', async (req, res) => {
    try {
        // In a real app, you would get the user_id from the authenticated session
        // For demo purposes, we'll use user_id 3 (Nitish Kumar)
        const userId = 3;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove sensitive information
        const { password, ...userProfile } = data;

        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

/**
 * @route PUT /api/users/profile
 * @description Update user profile
 * @access Private
 */
router.put('/profile', async (req, res) => {
    try {
        // In a real app, you would get the user_id from the authenticated session
        // For demo purposes, we'll use user_id 3 (Nitish Kumar)
        const userId = 3;

        const { name, email, phone, risk_profile } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Update user profile
        const { data, error } = await supabase
            .from('users')
            .update({
                name,
                email,
                phone,
                risk_profile
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Remove sensitive information
        const { password, ...updatedProfile } = data;

        res.json(updatedProfile);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

/**
 * @route POST /api/users/login
 * @description Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // In a real app, you would use proper authentication with hashed passwords
        // For demo purposes, we'll just check if the email exists
        const { data, error } = await supabase
            .from('users')
            .select('user_id, name, email, risk_profile')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // In a real app, you would verify the password and generate a JWT token
        // For demo purposes, we'll just return the user data

        res.json({
            user: data,
            token: 'demo-token-' + data.user_id // This is just a placeholder
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * @route POST /api/users/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, risk_profile } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('user_id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // In a real app, you would hash the password before storing it
        // Create new user
        const { data, error } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password, // In a real app, this would be hashed
                phone,
                risk_profile: risk_profile || 'Moderate', // Default risk profile
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Remove sensitive information
        const { password: pwd, ...newUser } = data;

        // In a real app, you would generate a JWT token
        res.status(201).json({
            user: newUser,
            token: 'demo-token-' + newUser.user_id // This is just a placeholder
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router; 