'use client';

import { useState, useEffect } from 'react';
import PerformanceChart from '../../components/PerformanceChart';
import SectorAllocation from '../../components/SectorAllocation';

export default function Dashboard() {
    const [portfolioSummary, setPortfolioSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchPortfolioSummary = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${apiUrl}/portfolio`);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setPortfolioSummary(data);
            } catch (err) {
                console.error('Error fetching portfolio summary:', err);
                setError('Failed to load portfolio data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolioSummary();
    }, [apiUrl]);

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Investment Dashboard</h1>

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
                    {/* Portfolio Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Portfolio Value</h3>
                            <p className="text-2xl font-bold text-gray-800">
                                {formatCurrency(portfolioSummary?.totalValue || 0)}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Invested</h3>
                            <p className="text-2xl font-bold text-gray-800">
                                {formatCurrency(portfolioSummary?.totalInvested || 0)}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Returns</h3>
                            <p className={`text-2xl font-bold ${portfolioSummary?.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(portfolioSummary?.totalReturns || 0)}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-sm font-medium text-gray-500">Return Percentage</h3>
                            <p className={`text-2xl font-bold ${portfolioSummary?.percentageGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(portfolioSummary?.percentageGain || 0).toFixed(2)}%
                            </p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <PerformanceChart
                            apiEndpoint={`${apiUrl}/portfolio/performance`}
                            title="Portfolio Performance"
                            height="400px"
                        />

                        <SectorAllocation
                            apiEndpoint={`${apiUrl}/portfolio/sectors`}
                            title="Sector Allocation"
                        />
                    </div>

                    {/* Investments Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                        <h3 className="text-lg font-semibold p-4 border-b">Your Investments</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fund Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Risk Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount Invested
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Returns
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {portfolioSummary?.investments.map((investment) => (
                                        <tr key={investment.investmentId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{investment.fundName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{investment.fundType}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${investment.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                                                        investment.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'}`}>
                                                    {investment.riskLevel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(investment.amountInvested)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(investment.currentValue)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${investment.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {investment.returns.toFixed(2)}%
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 