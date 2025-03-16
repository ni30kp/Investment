'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface PerformanceDataItem {
    date: string;
    value: number;
    changePercentage?: number;
}

interface PerformanceData {
    period: string;
    interval: string;
    data: PerformanceDataItem[];
}

interface ChartDataset {
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
    pointRadius: number;
    pointHoverRadius: number;
}

interface ChartDataType {
    labels: string[];
    datasets: ChartDataset[];
}

export default function PerformanceChart() {
    const [activeTimeframe, setActiveTimeframe] = useState<string>('1M');
    const [chartData, setChartData] = useState<ChartDataType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInterval, setSelectedInterval] = useState<string>('daily');
    const [fetchTrigger, setFetchTrigger] = useState<number>(0);
    const [currentValue, setCurrentValue] = useState<number>(550000);
    const [changeValue, setChangeValue] = useState<number>(50000);
    const [changePercent, setChangePercent] = useState<number>(10);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const performanceEndpoint = `${apiUrl}/portfolio/performance`;

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value).replace('₹', '₹');
    };

    // Direct fetch function for debugging
    const fetchPerformanceData = useCallback(async () => {
        console.log(`[PerformanceChart.tsx] Fetching data for timeframe=${activeTimeframe}, interval=${selectedInterval}`);
        setIsLoading(true);
        setError(null);

        try {
            const url = `${performanceEndpoint}?period=${activeTimeframe}&interval=${selectedInterval}`;
            console.log(`[PerformanceChart.tsx] Fetching from URL: ${url}`);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json() as PerformanceData;
            console.log('[PerformanceChart.tsx] Received data:', data);

            if (!data || !data.data || data.data.length === 0) {
                console.warn('[PerformanceChart.tsx] No data available for the selected period');
                setError('No data available for the selected period');
                setChartData(null);
                return;
            }

            // Update current value and change based on the data
            if (data.data.length > 0) {
                const lastValue = data.data[data.data.length - 1].value;
                const firstValue = data.data[0].value;
                const change = lastValue - firstValue;
                const changePercentage = (change / firstValue) * 100;

                setCurrentValue(lastValue);
                setChangeValue(change);
                setChangePercent(parseFloat(changePercentage.toFixed(1)));
            }

            // Format the data for the chart
            const formattedData: ChartDataType = {
                labels: data.data.map((item: PerformanceDataItem) => {
                    const date = new Date(item.date);
                    return formatDate(date, activeTimeframe);
                }),
                datasets: [
                    {
                        data: data.data.map((item: PerformanceDataItem) => item.value),
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                    },
                ],
            };

            console.log('[PerformanceChart.tsx] Setting chart data:', formattedData);
            setChartData(formattedData);
        } catch (err) {
            console.error('[PerformanceChart.tsx] Error fetching performance data:', err);
            setError(`Failed to load performance data: ${err instanceof Error ? err.message : 'Unknown error'}`);

            // Use fallback data if API fails
            const fallbackData = getFallbackData();
            setChartData(fallbackData);

            // Set fallback values
            setCurrentValue(550000);
            setChangeValue(50000);
            setChangePercent(10);
        } finally {
            setIsLoading(false);
        }
    }, [activeTimeframe, selectedInterval, performanceEndpoint]);

    // Format date based on selected range
    const formatDate = (date: Date, range: string): string => {
        if (!date || isNaN(date.getTime())) {
            console.warn('[PerformanceChart.tsx] Invalid date:', date);
            return 'Invalid date';
        }

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        if (range === '1M' || range === '3M') {
            return `${day} ${month}`;
        } else if (range === '6M' || range === '1Y') {
            return `${month} ${year}`;
        } else {
            return `${month} ${year}`;
        }
    };

    // Fallback data in case API fails
    const getFallbackData = (): ChartDataType => {
        const labels = ['7 Feb', '12 Feb', '17 Feb', '22 Feb', '27 Feb', '4 Mar', '9 Mar'];
        return {
            labels,
            datasets: [
                {
                    data: [520000, 510000, 530000, 525000, 540000, 535000, 575000],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                },
            ],
        };
    };

    // Effect to fetch data when dependencies change
    useEffect(() => {
        console.log(`[PerformanceChart.tsx] useEffect triggered: timeframe=${activeTimeframe}, interval=${selectedInterval}, fetchTrigger=${fetchTrigger}`);
        fetchPerformanceData();
    }, [fetchPerformanceData, fetchTrigger]);

    // Handle timeframe change
    const handleTimeframeChange = (timeframe: string) => {
        console.log(`[PerformanceChart.tsx] BUTTON CLICKED: Changing timeframe to ${timeframe}`);

        if (timeframe === activeTimeframe) {
            console.log(`[PerformanceChart.tsx] Timeframe ${timeframe} already selected, forcing refresh`);
            // If the same timeframe is clicked again, force a refresh
            setFetchTrigger(prev => prev + 1);
            return;
        }

        // Update the selected timeframe
        setActiveTimeframe(timeframe);

        // Adjust interval based on timeframe for better visualization
        let newInterval;
        if (timeframe === '1M' || timeframe === '3M') {
            newInterval = 'daily';
        } else if (timeframe === '6M' || timeframe === '1Y') {
            newInterval = 'monthly';
        } else {
            newInterval = 'monthly';
        }

        console.log(`[PerformanceChart.tsx] Setting interval to ${newInterval} based on timeframe ${timeframe}`);
        setSelectedInterval(newInterval);

        // Force a re-fetch by incrementing the trigger
        setFetchTrigger(prev => prev + 1);
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1F2937',
                titleColor: '#F9FAFB',
                bodyColor: '#D1D5DB',
                borderColor: '#374151',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        return `₹${context.parsed.y.toLocaleString()}`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 10,
                    },
                    maxRotation: 0,
                },
            },
            y: {
                display: false,
                grid: {
                    display: false,
                },
            },
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 2,
                borderColor: '#3B82F6',
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 5,
                hoverBorderWidth: 2,
                backgroundColor: '#3B82F6',
                borderColor: '#1F2937',
            },
        },
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-white">Performance Summary</h2>
                    <div className="flex items-center mt-2">
                        <div className="text-2xl font-bold text-white">₹{formatCurrency(currentValue).replace('₹', '')}</div>
                        <div className="ml-4 flex items-center">
                            <span className={`mr-1 ${changeValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {changeValue >= 0 ? '+' : ''}₹{formatCurrency(Math.abs(changeValue)).replace('₹', '')}
                            </span>
                            <span className={changeValue >= 0 ? 'text-green-500' : 'text-red-500'}>|</span>
                            <span className={`ml-1 ${changeValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {changeValue >= 0 ? '+' : ''}{changePercent}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-64 relative">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && !chartData && (
                    <div className="flex items-center justify-center h-full text-red-500">
                        {error}
                    </div>
                )}

                {!isLoading && chartData && (
                    <Line options={options} data={chartData} />
                )}

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded text-xs">
                    28 Feb 2025
                </div>
            </div>

            <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                    {['1M', '3M', '6M', '1Y', '3Y', 'MAX'].map((timeframe) => (
                        <button
                            key={timeframe}
                            className={`px-4 py-2 rounded-md text-sm ${activeTimeframe === timeframe
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            onClick={() => handleTimeframeChange(timeframe)}
                        >
                            {timeframe}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 