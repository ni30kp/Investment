import { cookies } from 'next/headers';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import InvestmentSummary from '../components/InvestmentSummary';
import PerformanceChart from '../components/PerformanceChart';
import SectorAllocation from '../components/SectorAllocation';
import PortfolioNav from '../components/PortfolioNav';

// Import API functions
import { portfolioAPI } from '@/utils/api';

export default async function Portfolio() {
    // Fetch portfolio data from API
    let portfolioData;
    try {
        portfolioData = await portfolioAPI.get();
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        portfolioData = null;
    }

    // Fetch sector allocation data
    let sectorData;
    try {
        sectorData = await portfolioAPI.getSectorAllocation();
    } catch (error) {
        console.error('Error fetching sector allocation:', error);
        sectorData = [];
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <Header />

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Portfolio</h1>
                </div>

                <InvestmentSummary />

                <PortfolioNav />

                <PerformanceChart />

                <div className="grid grid-cols-1 gap-6">
                    <SectorAllocation sectorData={sectorData} />
                </div>
            </main>
        </div>
    );
} 