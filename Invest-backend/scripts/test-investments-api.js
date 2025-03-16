// Use axios instead of node-fetch for compatibility
const axios = require('axios');

// API base URL
const API_BASE_URL = 'http://localhost:5001/api';

// Test the investments API
async function testInvestmentsAPI() {
    console.log('Testing Investments API...');
    console.log('==========================');

    try {
        // Test GET /api/investments
        console.log('\nTesting GET /api/investments');
        try {
            const investmentsResponse = await axios.get(`${API_BASE_URL}/investments`);
            console.log(`Success! Received ${investmentsResponse.data.length} investments`);
            console.log('First investment:', JSON.stringify(investmentsResponse.data[0], null, 2));
        } catch (error) {
            console.error(`Error: ${error.response?.status || 'Unknown'} - ${error.response?.data?.error || error.message}`);
        }

        // Test GET /api/investments/summary
        console.log('\nTesting GET /api/investments/summary');
        try {
            const summaryResponse = await axios.get(`${API_BASE_URL}/investments/summary`);
            console.log('Success! Received investment summary:');
            console.log(JSON.stringify(summaryResponse.data, null, 2));
        } catch (error) {
            console.error(`Error: ${error.response?.status || 'Unknown'} - ${error.response?.data?.error || error.message}`);
        }

        console.log('\nAPI tests completed!');
    } catch (error) {
        console.error('Error during API tests:', error);
    }
}

// Run the tests
testInvestmentsAPI(); 