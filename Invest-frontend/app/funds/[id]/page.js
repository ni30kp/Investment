'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PerformanceChart from '../../../components/PerformanceChart';
import SectorAllocation from '../../../components/SectorAllocation';

export default function FundDetail() {
    const params = useParams();
    const fundId = params.id;

    const [fundDetails, setFundDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchFundDetails = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${apiUrl}/funds/${fundId}`);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setFundDetails(data);
            } catch (err) {
                console.error('Error fetching fund details:', err);
                setError('Failed to load fund details');
            } finally {
                setIsLoading(false);
            }
        };

        if (fundId) {
            fetchFundDetails();
        }
    }, [apiUrl, fundId]);

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Format percentage
    const formatPercentage = (value) => {
        return `${value.toFixed(2)}%`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            ) : (
                <>
                    {/* Fund Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">{fundDetails?.fund_name}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Fund Type:</span> {fundDetails?.fund_type}
                            </div>
                            <div>
                                <span className="font-medium">Risk Level:</span>
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${fundDetails?.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                                        fundDetails?.risk_level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'}`}>
                                    {fundDetails?.risk_level}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">NAV:</span> {formatCurrency(fundDetails?.nav || 0)}
                            </div>
                            <div>
                                <span className="font-medium">AUM:</span> {formatCurrency(fundDetails?.aum || 0)}
                            </div>
                            <div>
                                <span className="font-medium">Expense Ratio:</span> {formatPercentage(fundDetails?.expense_ratio || 0)}
                            </div>
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="mb-8">
                        <PerformanceChart
                            apiEndpoint={`${apiUrl}/funds/${fundId}/performance`}
                            title="Fund Performance"
                            height="400px"
                        />
                    </div>

                    {/* Fund Allocations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Sector Allocation */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-semibold mb-4">Sector Allocation</h3>
                            <div className="h-80">
                                {fundDetails?.sectors && fundDetails.sectors.length > 0 ? (
                                    <div className="h-full">
                                        <div className="grid grid-cols-1 gap-2 h-full overflow-y-auto">
                                            {fundDetails.sectors.map((sector, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium">{sector.sectorName}</div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                            <div
                                                                className="bg-blue-600 h-2.5 rounded-full"
                                                                style={{ width: `${sector.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 text-sm font-medium">
                                                        {formatPercentage(sector.percentage)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No sector allocation data available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Market Cap Allocation */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-semibold mb-4">Market Cap Allocation</h3>
                            <div className="h-80">
                                {fundDetails?.marketCaps && fundDetails.marketCaps.length > 0 ? (
                                    <div className="h-full">
                                        <div className="grid grid-cols-1 gap-4 h-full">
                                            {fundDetails.marketCaps.map((marketCap, index) => (
                                                <div key={index} className="flex flex-col">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm font-medium">{marketCap.category}</span>
                                                        <span className="text-sm font-medium">{formatPercentage(marketCap.percentage)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                                        <div
                                                            className={`h-4 rounded-full ${marketCap.category === 'Large Cap' ? 'bg-blue-600' :
                                                                    marketCap.category === 'Mid Cap' ? 'bg-purple-600' :
                                                                        'bg-green-600'
                                                                }`}
                                                            style={{ width: `${marketCap.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No market cap allocation data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top Holdings */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                        <h3 className="text-lg font-semibold p-4 border-b">Top Holdings</h3>

                        <div className="overflow-x-auto">
                            {fundDetails?.stocks && fundDetails.stocks.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ticker
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Allocation
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {fundDetails.stocks.map((stock, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{stock.stockName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{stock.ticker}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{formatPercentage(stock.percentage)}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No holdings data available
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 