'use client';

import { useState, useEffect } from 'react';
import PerformanceChart from './PerformanceChart';
import OverlapAnalysis from './OverlapAnalysis';
import SectorAllocation from './SectorAllocation';
import { fundAPI, portfolioAPI } from '../../utils/api';

interface InvestmentSummary {
    id: number;
    user_id: number;
    total_value: number;
    total_invested: number;
    total_returns: number;
    one_day_change?: number;
    five_day_change?: number;
    inception_change?: number;
    created_at: string;
    updated_at: string;
}

interface SectorData {
    name: string;
    value: number;
    percentage: number;
}

interface OverlapData {
    funds: { id: number; name: string }[];
    stocksOverlap: number;
    averageOverlapPercentage: number;
    commonStocks: string[];
}

interface FundPair {
    fund1: number;
    fund2: number;
    data: OverlapData;
}

const UpGraph = () => (
    <svg className="w-3 h-3 inline-block mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17L9 11L13 15L21 7M21 7H15M21 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DownGraph = () => (
    <svg className="w-3 h-3 inline-block mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7L9 13L13 9L21 17M21 17V11M21 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Dashboard() {
    // Default to portfolio tab for PHA dashboard
    const [activeTab, setActiveTab] = useState<'performance' | 'portfolio'>('portfolio');
    const [investmentSummary, setInvestmentSummary] = useState<InvestmentSummary>({
        id: 0,
        user_id: 0,
        total_value: 0,
        total_invested: 0,
        total_returns: 0,
        created_at: '',
        updated_at: ''
    });
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);
    const [overlapPairs, setOverlapPairs] = useState<FundPair[]>([]);
    const [isLoadingOverlap, setIsLoadingOverlap] = useState(false);
    const [isLoadingSectors, setIsLoadingSectors] = useState(false);
    const [allFunds, setAllFunds] = useState([
        { id: 1, name: 'Axis Bluechip Fund' },
        { id: 2, name: 'HDFC Top 100 Fund' },
        { id: 3, name: 'ICICI Prudential Bluechip Fund' },
        { id: 4, name: 'SBI Bluechip Fund' }
    ]);
    const [commonStocks, setCommonStocks] = useState<string[]>([]);

    // Sector allocation data
    const [sectorData, setSectorData] = useState<SectorData[]>([]);

    // Fetch investment summary data
    useEffect(() => {
        async function fetchInvestmentSummary() {
            setIsLoadingSummary(true);
            try {
                const response = await fetch('http://localhost:5001/api/portfolio');
                if (!response.ok) {
                    throw new Error('Failed to fetch portfolio data');
                }
                const data = await response.json();
                setInvestmentSummary(data);
            } catch (error) {
                console.error('Error fetching investment summary:', error);
            } finally {
                setIsLoadingSummary(false);
            }
        }

        fetchInvestmentSummary();
    }, []);

    // Fetch sector data from backend
    useEffect(() => {
        async function fetchSectorData() {
            if (activeTab === 'portfolio') {
                setIsLoadingSectors(true);
                try {
                    const data = await portfolioAPI.getSectorAllocation();
                    if (data && Array.isArray(data)) {
                        setSectorData(data);
                    }
                } catch (error) {
                    console.error('Error fetching sector data:', error);
                    setSectorData([]);
                } finally {
                    setIsLoadingSectors(false);
                }
            }
        }

        fetchSectorData();
    }, [activeTab]);

    // Fetch overlap data for all fund pairs
    useEffect(() => {
        async function fetchOverlapData() {
            if (activeTab === 'portfolio') {
                setIsLoadingOverlap(true);
                try {
                    // Define all fund pairs to fetch
                    const pairs = [
                        { fund1: 1, fund2: 2 },
                        { fund1: 1, fund2: 3 },
                        { fund1: 1, fund2: 4 },
                        { fund1: 2, fund2: 3 },
                        { fund1: 2, fund2: 4 },
                        { fund1: 3, fund2: 4 }
                    ];

                    // Fetch data for each pair
                    const pairsWithData = await Promise.all(
                        pairs.map(async (pair) => {
                            try {
                                const data = await fundAPI.getOverlap(pair.fund1, pair.fund2);
                                return { ...pair, data };
                            } catch (error) {
                                console.error(`Error fetching overlap for funds ${pair.fund1}-${pair.fund2}:`, error);
                                return null;
                            }
                        })
                    );

                    // Filter out any failed requests
                    const validPairs = pairsWithData.filter(pair => pair !== null) as FundPair[];
                    setOverlapPairs(validPairs);

                    // Collect all common stocks from all pairs
                    const allCommonStocks = new Set<string>();
                    validPairs.forEach(pair => {
                        if (pair.data && pair.data.commonStocks) {
                            pair.data.commonStocks.forEach(stock => allCommonStocks.add(stock));
                        }
                    });

                    setCommonStocks(Array.from(allCommonStocks));

                } catch (error) {
                    console.error('Error fetching overlap data:', error);
                } finally {
                    setIsLoadingOverlap(false);
                }
            }
        }

        fetchOverlapData();
    }, [activeTab]);

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-IN');
    };

    // Helper function to format percentage with proper handling of undefined/null values
    const formatPercentage = (value: number | undefined | null) => {
        if (value === undefined || value === null) return '0.0';
        return value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
    };

    // Prepare fund data for the OverlapAnalysis component
    const prepareFundsForVisualization = () => {
        const colors = ['#FFD700', '#4169E1', '#32CD32', '#FF6347'];

        return allFunds.map((fund, index) => ({
            id: fund.id.toString(),
            name: fund.name,
            color: colors[index % colors.length]
        }));
    };

    // Calculate average overlap percentage across all pairs
    const calculateAverageOverlap = () => {
        if (overlapPairs.length === 0) return 0;

        const sum = overlapPairs.reduce((acc, pair) => {
            return acc + (pair.data?.averageOverlapPercentage || 0);
        }, 0);

        return (sum / overlapPairs.length).toFixed(1);
    };

    // Get CSS class for sector tile based on percentage
    const getSectorTileClass = (percentage: number) => {
        if (percentage >= 30) {
            return 'col-span-12 md:col-span-8';
        } else if (percentage >= 15) {
            return 'col-span-12 md:col-span-4';
        } else if (percentage >= 12) {
            return 'col-span-6 md:col-span-4';
        } else {
            return 'col-span-6 md:col-span-3';
        }
    };

    // Calculate percentage gain with proper handling of undefined values
    const calculatePercentageGain = (totalValue: number, totalInvested: number) => {
        if (!totalInvested || totalInvested === 0) return 0;
        return ((totalValue - totalInvested) / totalInvested * 100);
    };

    // Helper function to format percentage with proper handling of undefined/null values and time indicator
    const formatPercentageWithTime = (value: number | undefined | null, timeIndicator: string) => {
        return (
            <div className={`${(value || 0) >= 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'} text-xs px-2 py-1 rounded flex items-center`}>
                {(value || 0) >= 0 ? <UpGraph /> : <DownGraph />}
                {formatPercentage(value)}%
                <span className="text-[10px] ml-1">{timeIndicator}</span>
            </div>
        );
    };

    return (
        <div className="text-white">
            <div className="mb-6">
                <h2 className="text-xl font-bold">Portfolio Health Analysis Dashboard</h2>
                <p className="text-gray-400">Evaluate Your Investment Performance</p>
            </div>

            {/* Investment Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {isLoadingSummary ? (
                    <div className="col-span-4 flex justify-center items-center h-32">
                        <p>Loading investment summary...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-gray-400">Current</p>
                                    <p className="text-xs text-gray-400">Investment Value</p>
                                </div>
                                {formatPercentageWithTime(calculatePercentageGain(
                                    investmentSummary?.total_value || 0,
                                    investmentSummary?.total_invested || 0
                                ), '1D')}
                            </div>
                            <p className="text-xl font-bold">₹{formatCurrency(investmentSummary?.total_value || 0)}</p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-gray-400">Initial</p>
                                    <p className="text-xs text-gray-400">Investment Value</p>
                                </div>
                                {formatPercentageWithTime(15, 'Inception')}
                            </div>
                            <p className="text-xl font-bold">₹{formatCurrency(investmentSummary?.total_invested || 0)}</p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-gray-400">Best</p>
                                    <p className="text-xs text-gray-400">Performing Scheme</p>
                                </div>
                                {formatPercentageWithTime(19, 'Inception')}
                            </div>
                            <p className="text-sm font-bold">
                                ICICI Prudential Midcap Fund
                            </p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-gray-400">Worst</p>
                                    <p className="text-xs text-gray-400">Performing Scheme</p>
                                </div>
                                {formatPercentageWithTime(-2, 'Inception')}
                            </div>
                            <p className="text-sm font-bold">
                                Axis Flexi Cap Fund
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-6">
                <div className="flex">
                    <button
                        className={`py-2 px-4 text-sm font-medium ${activeTab === 'performance'
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Performance Metrics
                    </button>
                    <button
                        className={`py-2 px-4 text-sm font-medium ${activeTab === 'portfolio'
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                        onClick={() => setActiveTab('portfolio')}
                    >
                        Portfolio Composition
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {
                activeTab === 'performance' ? (
                    <div>
                        <div className="mb-8">
                            <PerformanceChart />
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Sector Allocation */}
                        <div className="bg-gray-800 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-medium mb-4">Sector Allocation</h3>
                            {isLoadingSectors ? (
                                <div className="flex justify-center items-center h-64">
                                    <p>Loading sector data...</p>
                                </div>
                            ) : (
                                <SectorAllocation sectorData={sectorData} />
                            )}
                        </div>

                        {/* Overlap Analysis */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <h3 className="text-lg font-medium">Overlap Analysis</h3>
                                <div className="ml-2 text-gray-400 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            {isLoadingOverlap ? (
                                <div className="flex justify-center items-center h-64">
                                    <p>Loading overlap data...</p>
                                </div>
                            ) : overlapPairs.length > 0 ? (
                                <>
                                    <div className="mb-4">
                                        <p className="text-sm mb-1">
                                            Comparing : Motilal Large Cap Fund and Nippon Large Cap Fund
                                        </p>
                                        <ul className="list-disc list-inside text-xs text-yellow-400 ml-1">
                                            <li className="mb-1">
                                                {commonStocks.length} Stocks Overlap across these funds.
                                            </li>
                                            <li>
                                                {calculateAverageOverlap()}% Average Overlap in holdings.
                                            </li>
                                        </ul>
                                    </div>
                                    <OverlapAnalysis
                                        funds={prepareFundsForVisualization()}
                                        commonStocks={commonStocks}
                                        overlapPairs={overlapPairs}
                                    />
                                </>
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <p>No overlap data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div>
    );
} 