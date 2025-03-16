// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Generic fetch function with error handling
async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`Fetching from: ${url}`);

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || 'API request failed';
            } catch (e) {
                errorMessage = `API request failed with status ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// User API
export const userAPI = {
    getProfile: () => fetchFromAPI('/users/profile'),
    getAll: () => fetchFromAPI('/users'),
};

// Investment API
export const investmentAPI = {
    getAll: () => fetchFromAPI('/investments'),
    getSummary: () => fetchFromAPI('/investments/summary'),
};

// Fund API
export const fundAPI = {
    getAll: () => fetchFromAPI('/funds'),
    getById: (id: number) => fetchFromAPI(`/funds/${id}`),
    getOverlap: (fund1?: number, fund2?: number) => {
        let endpoint = '/funds/overlap';
        if (fund1 && fund2) {
            endpoint += `?fund1=${fund1}&fund2=${fund2}`;
        }
        return fetchFromAPI(endpoint);
    },
    getPerformance: (id: number, period: string = '1M', interval: string = 'daily') =>
        fetchFromAPI(`/funds/${id}/performance?period=${period}&interval=${interval}`),
    getSectors: (id: number) => fetchFromAPI(`/funds/${id}/sectors`),
    getStocks: (id: number) => fetchFromAPI(`/funds/${id}/stocks`),
};

// Portfolio API
export const portfolioAPI = {
    get: () => fetchFromAPI('/portfolio'),
    getSectorAllocation: () => fetchFromAPI('/portfolio/sectors'),
    getPerformance: (period: string = '1M', interval: string = 'daily') =>
        fetchFromAPI(`/portfolio/performance?period=${period}&interval=${interval}`),
    getHealth: () => fetchFromAPI('/portfolio/health'),
};

// Transaction API
export const transactionAPI = {
    getAll: () => fetchFromAPI('/transactions'),
}; 