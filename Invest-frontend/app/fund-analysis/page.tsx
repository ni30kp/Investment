import { cookies } from 'next/headers';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FundOverlap from '../components/FundOverlap';

// Import API functions
import { fundAPI } from '@/utils/api';

export default async function FundAnalysis() {
    // Fetch fund data from API
    let fundData;
    try {
        fundData = await fundAPI.getAll();
    } catch (error) {
        console.error('Error fetching funds:', error);
        fundData = [];
    }

    // Fetch fund overlap data
    let overlapData;
    try {
        overlapData = await fundAPI.getOverlap();
    } catch (error) {
        console.error('Error fetching fund overlap:', error);
        overlapData = null;
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <Header />

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Fund Analysis</h1>
                </div>

                <FundOverlap overlapData={overlapData} />
            </main>
        </div>
    );
} 