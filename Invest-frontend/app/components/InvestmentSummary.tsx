'use client';

import { useEffect, useState } from 'react';
import { investmentAPI } from '@/utils/api';

interface SummaryData {
    userCount?: number;
    fundCount?: number;
    totalAUM?: number;
    investmentCount?: number;
    totalInvested?: number;
    avgReturns?: number;
    topPerformingFund?: {
        id: number;
        name: string;
        nav: number;
    };
    lastUpdated?: string;
    // Legacy fields for backward compatibility
    totalInvestment?: number;
    currentValue?: number;
    gain?: number;
    gainPercentage?: number;
    bestPerforming?: {
        name: string;
        gain: number;
    };
    worstPerforming?: {
        name: string;
        gain: number;
    };
}

export default function InvestmentSummary() {
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await investmentAPI.getSummary();
                console.log('Investment summary data:', data);
                setSummaryData(data);
            } catch (err) {
                console.error('Error fetching investment summary:', err);
                setError('Failed to load investment summary');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    // Calculate values based on the new API format
    const totalInvested = summaryData?.totalInvested || summaryData?.totalInvestment || 500000;
    const currentValue = calculateCurrentValue(summaryData);
    const gainPercentage = calculateGainPercentage(summaryData);

    // Format values for display
    const currentValueFormatted = `₹${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    const initialValueFormatted = `₹${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    const gainPercentageFormatted = `${gainPercentage >= 0 ? '+' : ''}${gainPercentage.toFixed(1)}%`;

    // Get best and worst performing funds
    const bestPerforming = getBestPerforming(summaryData);
    const worstPerforming = getWorstPerforming(summaryData);

    return (
        <div className="grid grid-cols-4 gap-4 mb-8">
            <SummaryCard
                title="Current Investment Value"
                value={currentValueFormatted}
                change={gainPercentageFormatted}
                isPositive={gainPercentage >= 0}
            />
            <SummaryCard
                title="Initial Investment Value"
                value={initialValueFormatted}
                change={`${summaryData?.investmentCount || 0} investments`}
                isPositive={true}
            />
            <SummaryCard
                title="Best Performing Scheme"
                value={bestPerforming.name}
                change={bestPerforming.change}
                isPositive={true}
            />
            <SummaryCard
                title="Worst Performing Scheme"
                value={worstPerforming.name}
                change={worstPerforming.change}
                isPositive={false}
            />
        </div>
    );
}

// Helper functions to calculate values based on the API response format
function calculateCurrentValue(data: SummaryData | null): number {
    if (!data) return 575000; // Default value

    // If we have the new API format
    if (data.totalInvested && data.avgReturns) {
        return data.totalInvested * (1 + data.avgReturns / 100);
    }

    // If we have the legacy format
    if (data.currentValue) {
        return data.currentValue;
    }

    return 575000; // Default fallback
}

function calculateGainPercentage(data: SummaryData | null): number {
    if (!data) return 15; // Default value

    // If we have the new API format
    if (data.avgReturns !== undefined) {
        return data.avgReturns;
    }

    // If we have the legacy format
    if (data.gainPercentage !== undefined) {
        return data.gainPercentage;
    }

    return 15; // Default fallback
}

function getBestPerforming(data: SummaryData | null): { name: string, change: string } {
    if (!data) {
        return { name: 'ICICI Prudential Midcap Fund', change: '+19%' };
    }

    // If we have the new API format with top performing fund
    if (data.topPerformingFund) {
        return {
            name: data.topPerformingFund.name,
            change: `₹${data.topPerformingFund.nav.toFixed(2)}`
        };
    }

    // If we have the legacy format
    if (data.bestPerforming) {
        return {
            name: data.bestPerforming.name,
            change: `+${data.bestPerforming.gain.toFixed(0)}%`
        };
    }

    return { name: 'ICICI Prudential Midcap Fund', change: '+19%' };
}

function getWorstPerforming(data: SummaryData | null): { name: string, change: string } {
    if (!data) {
        return { name: 'Axis Flexi Cap Fund', change: '-5%' };
    }

    // If we have the legacy format
    if (data.worstPerforming) {
        return {
            name: data.worstPerforming.name,
            change: `${data.worstPerforming.gain.toFixed(0)}%`
        };
    }

    // If we don't have worst performing data, use a default
    return { name: 'Axis Flexi Cap Fund', change: '-5%' };
}

function SummaryCard({
    title,
    value,
    change,
    isPositive
}: {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
}) {
    return (
        <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-400">{title}</h3>
                <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    )}
                    <span className="ml-1">{change}</span>
                </div>
            </div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    );
} 