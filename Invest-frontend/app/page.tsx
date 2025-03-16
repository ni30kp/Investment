import { cookies } from 'next/headers';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

// Import API functions
import { userAPI, investmentAPI } from '@/utils/api';

export default async function Home() {
    // Fetch user data from API
    let userData;
    try {
        userData = await userAPI.getProfile();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        userData = { name: 'Yashna' }; // Fallback
    }

    // Fetch investment data from API
    let investmentData;
    try {
        investmentData = await investmentAPI.getAll();
    } catch (error) {
        console.error('Error fetching investments:', error);
        investmentData = [];
    }

    return (
        <div className="flex bg-gray-900 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6">
                <Header username={userData?.name || 'Yashna'} />
                <Dashboard />
            </main>
        </div>
    );
} 