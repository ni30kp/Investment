'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FundsListing() {
    const [funds, setFunds] = useState([]);
    const [filteredFunds, setFilteredFunds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterRisk, setFilterRisk] = useState('All');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchFunds = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${apiUrl}/funds`);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setFunds(data);
                setFilteredFunds(data);
            } catch (err) {
                console.error('Error fetching funds:', err);
                setError('Failed to load funds data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFunds();
    }, [apiUrl]);

    // Apply filters when search term or filters change
    useEffect(() => {
        let result = funds;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(fund =>
                fund.fund_name.toLowerCase().includes(term) ||
                fund.fund_type.toLowerCase().includes(term)
            );
        }

        // Apply fund type filter
        if (filterType !== 'All') {
            result = result.filter(fund => fund.fund_type === filterType);
        }

        // Apply risk level filter
        if (filterRisk !== 'All') {
            result = result.filter(fund => fund.risk_level === filterRisk);
        }

        setFilteredFunds(result);
    }, [funds, searchTerm, filterType, filterRisk]);

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(value);
    };

    // Get unique fund types for filter
    const fundTypes = ['All', ...new Set(funds.map(fund => fund.fund_type))];

    // Get unique risk levels for filter
    const riskLevels = ['All', ...new Set(funds.map(fund => fund.risk_level))];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Mutual Funds</h1>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Funds
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Fund Type Filter */}
                    <div>
                        <label htmlFor="fundType" className="block text-sm font-medium text-gray-700 mb-1">
                            Fund Type
                        </label>
                        <select
                            id="fundType"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            {fundTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Risk Level Filter */}
                    <div>
                        <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 mb-1">
                            Risk Level
                        </label>
                        <select
                            id="riskLevel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                        >
                            {riskLevels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

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
                    {/* Results Count */}
                    <div className="mb-4 text-gray-600">
                        Showing {filteredFunds.length} of {funds.length} funds
                    </div>

                    {/* Funds List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFunds.map((fund) => (
                            <Link href={`/funds/${fund.fund_id}`} key={fund.fund_id}>
                                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer h-full">
                                    <div className="p-4 border-b">
                                        <h3 className="text-lg font-semibold mb-1 text-gray-900">{fund.fund_name}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{fund.fund_type}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                        ${fund.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                                                    fund.risk_level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'}`}>
                                                {fund.risk_level}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">NAV</div>
                                                <div className="text-lg font-semibold">{formatCurrency(fund.nav)}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">AUM</div>
                                                <div className="text-lg font-semibold">{formatCurrency(fund.aum)}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Expense Ratio</div>
                                                <div className="text-lg font-semibold">{fund.expense_ratio}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Min. Investment</div>
                                                <div className="text-lg font-semibold">₹{fund.min_investment}</div>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-blue-600 text-sm font-medium">
                                            View Details →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredFunds.length === 0 && (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No funds found</h3>
                            <p className="text-gray-600">
                                Try adjusting your search or filter criteria to find what you're looking for.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 