'use client';

import { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { portfolioAPI, fundAPI } from '../utils/api';

// Register Chart.js components
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

const timeRanges = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: '3Y', value: '3Y' },
    { label: 'MAX', value: 'MAX' }
];

const PerformanceChart = ({
    apiEndpoint,
    title = 'Performance',
    showControls = true,
    height = '300px'
}) => {
    console.log(`[PerformanceChart] Initializing with apiEndpoint: ${apiEndpoint}`);

    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRange, setSelectedRange] = useState('1M');
    const [selectedInterval, setSelectedInterval] = useState('daily');
    const [fetchTrigger, setFetchTrigger] = useState(0); // Used to force re-fetch

    // Direct fetch function for debugging
    const directFetch = async (url) => {
        console.log(`[PerformanceChart] Direct fetch from: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            const data = await response.json();
            console.log('[PerformanceChart] Direct fetch response:', data);
            return data;
        } catch (err) {
            console.error('[PerformanceChart] Direct fetch error:', err);
            throw err;
        }
    };

    // Memoize the fetchData function to avoid recreating it on every render
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`[PerformanceChart] Fetching data for range=${selectedRange}, interval=${selectedInterval}, apiEndpoint=${apiEndpoint}`);

            let data;
            if (apiEndpoint.includes('/portfolio/performance')) {
                // Use direct fetch for debugging
                const url = `${apiEndpoint}?period=${selectedRange}&interval=${selectedInterval}`;
                console.log(`[PerformanceChart] Using direct fetch for portfolio performance: ${url}`);
                data = await directFetch(url);
            } else if (apiEndpoint.includes('/funds/')) {
                // Extract fund ID from the endpoint
                const fundId = apiEndpoint.split('/').filter(Boolean).pop();
                if (!isNaN(fundId)) {
                    // Use direct fetch for debugging
                    const url = `${apiEndpoint}?period=${selectedRange}&interval=${selectedInterval}`;
                    console.log(`[PerformanceChart] Using direct fetch for fund performance: ${url}`);
                    data = await directFetch(url);
                } else {
                    // For other endpoints, use the direct fetch approach
                    const url = `${apiEndpoint}?period=${selectedRange}&interval=${selectedInterval}`;
                    console.log(`[PerformanceChart] Fetching from URL: ${url}`);
                    data = await directFetch(url);
                }
            } else {
                // For other endpoints, use the direct fetch approach
                const url = `${apiEndpoint}?period=${selectedRange}&interval=${selectedInterval}`;
                console.log(`[PerformanceChart] Fetching from URL: ${url}`);
                data = await directFetch(url);
            }

            console.log('[PerformanceChart] Received data:', data);

            if (!data || !data.data || data.data.length === 0) {
                console.warn('[PerformanceChart] No data available for the selected period');
                setError('No data available for the selected period');
                setChartData(null);
                return;
            }

            // Format dates for display
            const formattedData = data.data.map(item => {
                const date = new Date(item.date);
                return {
                    ...item,
                    formattedDate: formatDate(date, selectedRange)
                };
            });

            console.log('[PerformanceChart] Formatted data:', formattedData);

            // Prepare chart data
            const chartDataConfig = {
                labels: formattedData.map(item => item.formattedDate),
                datasets: [
                    {
                        label: title,
                        data: formattedData.map(item => item.value || item.nav),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: formattedData.length > 30 ? 0 : 3,
                        pointHoverRadius: 5
                    }
                ]
            };

            console.log('[PerformanceChart] Setting chart data:', chartDataConfig);
            setChartData(chartDataConfig);
        } catch (err) {
            console.error('[PerformanceChart] Error fetching performance data:', err);
            setError('Failed to load performance data: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint, selectedRange, selectedInterval, title]);

    // Effect to fetch data when dependencies change
    useEffect(() => {
        console.log(`[PerformanceChart] useEffect triggered: range=${selectedRange}, interval=${selectedInterval}, fetchTrigger=${fetchTrigger}, apiEndpoint=${apiEndpoint}`);
        fetchData();
    }, [fetchData, fetchTrigger]);

    // Format date based on selected range
    const formatDate = (date, range) => {
        if (!date || isNaN(date.getTime())) {
            console.warn('[PerformanceChart] Invalid date:', date);
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

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        return `${title}: ₹${value.toLocaleString('en-IN')}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 6
                }
            },
            y: {
                beginAtZero: false,
                ticks: {
                    callback: (value) => `₹${value.toLocaleString('en-IN', {
                        notation: 'compact',
                        compactDisplay: 'short'
                    })}`
                }
            }
        }
    };

    // Handle range change
    const handleRangeChange = (range) => {
        console.log(`[PerformanceChart] BUTTON CLICKED: Changing range to ${range}`);
        alert(`Range button clicked: ${range}`); // Add alert for debugging

        if (range === selectedRange) {
            console.log(`[PerformanceChart] Range ${range} already selected, forcing refresh`);
            // If the same range is clicked again, force a refresh
            setFetchTrigger(prev => prev + 1);
            return;
        }

        // Update the selected range
        setSelectedRange(range);

        // Adjust interval based on range for better visualization
        let newInterval;
        if (range === '1M' || range === '3M') {
            newInterval = 'daily';
        } else if (range === '6M' || range === '1Y') {
            newInterval = 'monthly';
        } else {
            newInterval = 'monthly';
        }

        console.log(`[PerformanceChart] Setting interval to ${newInterval} based on range ${range}`);
        setSelectedInterval(newInterval);

        // Force a re-fetch by incrementing the trigger
        setFetchTrigger(prev => prev + 1);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>

                {showControls && (
                    <div className="flex space-x-2">
                        <div className="flex rounded-md overflow-hidden border border-gray-300">
                            {timeRanges.map((range) => (
                                <button
                                    key={range.value}
                                    className={`px-2 py-1 text-sm ${selectedRange === range.value
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => handleRangeChange(range.value)}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ height }}>
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center h-full text-red-500">
                        {error}
                    </div>
                )}

                {!isLoading && !error && chartData && (
                    <Line data={chartData} options={chartOptions} />
                )}
            </div>

            <div className="text-xs text-gray-500 mt-2">
                Selected range: {selectedRange}, Interval: {selectedInterval}, API: {apiEndpoint}
            </div>
        </div>
    );
};

export default PerformanceChart; 