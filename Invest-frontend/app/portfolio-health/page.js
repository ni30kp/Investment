'use client';

import { useState, useEffect } from 'react';
import PerformanceChart from '../../components/PerformanceChart';
import SectorAllocation from '../../components/SectorAllocation';

export default function PortfolioHealth() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchPortfolioData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch portfolio summary
                const summaryResponse = await fetch(`${apiUrl}/portfolio`);

                if (!summaryResponse.ok) {
                    throw new Error(`API error: ${summaryResponse.status}`);
                }

                const summaryData = await summaryResponse.json();

                // Fetch sector allocation
                const sectorResponse = await fetch(`${apiUrl}/portfolio/sectors`);

                if (!sectorResponse.ok) {
                    throw new Error(`API error: ${sectorResponse.status}`);
                }

                const sectorData = await sectorResponse.json();

                // Combine data
                setPortfolioData({
                    summary: summaryData,
                    sectors: sectorData
                });
            } catch (err) {
                console.error('Error fetching portfolio health data:', err);
                setError('Failed to load portfolio health data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolioData();
    }, [apiUrl]);

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Calculate diversification score (0-100)
    const calculateDiversificationScore = () => {
        if (!portfolioData?.sectors?.sectors) return 0;

        const sectors = portfolioData.sectors.sectors;

        // If there's only one sector, score is 0
        if (sectors.length <= 1) return 0;

        // Calculate Herfindahl-Hirschman Index (HHI)
        const hhi = sectors.reduce((sum, sector) => sum + Math.pow(sector.percentage / 100, 2), 0);

        // Convert HHI to a 0-100 score (lower HHI means better diversification)
        // HHI ranges from 1/n (perfect diversification) to 1 (complete concentration)
        // For n sectors, the minimum HHI is 1/n
        const minHHI = 1 / sectors.length;
        const maxHHI = 1;

        // Normalize to 0-100 scale
        const normalizedScore = ((maxHHI - hhi) / (maxHHI - minHHI)) * 100;

        return Math.min(100, Math.max(0, normalizedScore));
    };

    // Calculate risk score (0-100)
    const calculateRiskScore = () => {
        if (!portfolioData?.summary?.investments) return 0;

        const investments = portfolioData.summary.investments;

        // Calculate weighted risk score based on risk levels
        const riskWeights = {
            'Low': 25,
            'Moderate': 50,
            'High': 100
        };

        const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);

        const weightedRiskScore = investments.reduce((score, inv) => {
            const weight = inv.currentValue / totalValue;
            const riskValue = riskWeights[inv.riskLevel] || 50;
            return score + (weight * riskValue);
        }, 0);

        return weightedRiskScore;
    };

    // Calculate performance score (0-100)
    const calculatePerformanceScore = () => {
        if (!portfolioData?.summary) return 0;

        const { percentageGain } = portfolioData.summary;

        // Convert percentage gain to a 0-100 score
        // Assuming 15% annual return is excellent (100 score)
        // and 0% return is average (50 score)
        const score = 50 + (percentageGain / 15) * 50;

        return Math.min(100, Math.max(0, score));
    };

    // Get recommendations based on portfolio health
    const getRecommendations = () => {
        if (!portfolioData) return [];

        const recommendations = [];

        // Diversification recommendations
        const diversificationScore = calculateDiversificationScore();
        if (diversificationScore < 60) {
            recommendations.push({
                category: 'Diversification',
                text: 'Your portfolio is concentrated in a few sectors. Consider adding funds from different sectors to improve diversification.'
            });
        }

        // Risk recommendations
        const riskScore = calculateRiskScore();
        if (riskScore > 70) {
            recommendations.push({
                category: 'Risk',
                text: 'Your portfolio has a high risk level. Consider adding some low-risk funds to balance your portfolio.'
            });
        } else if (riskScore < 30) {
            recommendations.push({
                category: 'Risk',
                text: 'Your portfolio has a very low risk level. Consider adding some growth-oriented funds to potentially increase returns.'
            });
        }

        // Performance recommendations
        const performanceScore = calculatePerformanceScore();
        if (performanceScore < 50) {
            recommendations.push({
                category: 'Performance',
                text: 'Your portfolio is underperforming. Consider reviewing and replacing funds with poor performance.'
            });
        }

        // Add general recommendation if no specific ones
        if (recommendations.length === 0) {
            recommendations.push({
                category: 'General',
                text: 'Your portfolio is well-balanced. Continue to monitor performance and rebalance periodically.'
            });
        }

        return recommendations;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Portfolio Health Analysis</h1>

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
                    {/* Health Score */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Portfolio Health Score</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Diversification</h3>
                                <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                                        <div
                                            className="bg-blue-600 h-4 rounded-full"
                                            style={{ width: `${calculateDiversificationScore()}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{Math.round(calculateDiversificationScore())}%</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Risk Level</h3>
                                <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                                        <div
                                            className={`h-4 rounded-full ${calculateRiskScore() > 70 ? 'bg-red-500' :
                                                calculateRiskScore() > 30 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${calculateRiskScore()}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{Math.round(calculateRiskScore())}%</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Performance</h3>
                                <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                                        <div
                                            className={`h-4 rounded-full ${calculatePerformanceScore() > 70 ? 'bg-green-500' :
                                                calculatePerformanceScore() > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${calculatePerformanceScore()}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{Math.round(calculatePerformanceScore())}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

                    {/* Recommendations */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>

                        <div className="space-y-4">
                            {getRecommendations().map((recommendation, index) => (
                                <div key={index} className="flex">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${recommendation.category === 'Diversification' ? 'bg-blue-100 text-blue-600' :
                                        recommendation.category === 'Risk' ? 'bg-yellow-100 text-yellow-600' :
                                            recommendation.category === 'Performance' ? 'bg-green-100 text-green-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{recommendation.category}</h3>
                                        <p className="text-gray-600">{recommendation.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio Summary */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <h2 className="text-xl font-semibold p-6 border-b">Portfolio Summary</h2>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {formatCurrency(portfolioData?.summary?.totalValue || 0)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Total Invested</h3>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {formatCurrency(portfolioData?.summary?.totalInvested || 0)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Total Returns</h3>
                                    <p className={`text-2xl font-bold ${portfolioData?.summary?.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(portfolioData?.summary?.totalReturns || 0)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Return Percentage</h3>
                                    <p className={`text-2xl font-bold ${portfolioData?.summary?.percentageGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {(portfolioData?.summary?.percentageGain || 0).toFixed(2)}%
                                    </p>
                                </div>
                            </div>

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
                                        {portfolioData?.summary?.investments.map((investment) => (
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
                    </div>
                </>
            )}
        </div>
    );
} 