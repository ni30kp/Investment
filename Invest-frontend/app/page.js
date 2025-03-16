'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    const [summaryData, setSummaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchSummaryData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${apiUrl}/investments/summary`);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setSummaryData(data);
            } catch (err) {
                console.error('Error fetching summary data:', err);
                setError('Failed to load summary data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummaryData();
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
        <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 min-h-screen text-white">
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-6">InvestWelth</h2>

                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/funds" className="block px-4 py-2 rounded hover:bg-gray-700">
                                    Explore Funds
                                </Link>
                            </li>
                            <li>
                                <div className="block px-4 py-2 rounded bg-blue-600 text-white font-medium">
                                    Portfolio Health Analysis
                                </div>
                            </li>
                            <li>
                                <Link href="/profile" className="block px-4 py-2 rounded hover:bg-gray-700">
                                    Profile
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Invest Smarter with InvestWelth
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Track, analyze, and optimize your mutual fund investments all in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/dashboard" className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
                                View Dashboard
                            </Link>
                            <Link href="/funds" className="bg-transparent hover:bg-blue-700 border-2 border-white font-bold py-3 px-6 rounded-lg transition duration-300">
                                Explore Funds
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Summary Stats */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-10">Investment Insights</h2>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
                                {error}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                                    <p className="text-3xl font-bold text-blue-600">{summaryData?.userCount || 0}</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold mb-2">Total Funds</h3>
                                    <p className="text-3xl font-bold text-blue-600">{summaryData?.fundCount || 0}</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold mb-2">Total AUM</h3>
                                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(summaryData?.totalAUM || 0)}</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold mb-2">Average Returns</h3>
                                    <p className="text-3xl font-bold text-green-600">{(summaryData?.avgReturns || 0).toFixed(2)}%</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Why Choose InvestWelth?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Portfolio Tracking</h3>
                                <p className="text-gray-600">
                                    Track your mutual fund investments in real-time with detailed performance metrics and visualizations.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Fund Analysis</h3>
                                <p className="text-gray-600">
                                    Analyze fund performance, sector allocations, and risk metrics to make informed investment decisions.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Portfolio Health Analysis</h3>
                                <p className="text-gray-600">
                                    Get detailed insights into your portfolio health, including diversification, risk assessment, and optimization recommendations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Start Investing Smarter?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of investors who are using InvestWelth to track and optimize their mutual fund investments.
                        </p>
                        <Link href="/dashboard" className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                            Get Started Now
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
} 