'use client';

import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

// Generate colors for pie chart
const generateColors = (count) => {
    const baseColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(78, 205, 196, 0.7)',
        'rgba(255, 99, 71, 0.7)',
    ];

    // If we need more colors than in our base set, generate them
    if (count <= baseColors.length) {
        return baseColors.slice(0, count);
    }

    const colors = [...baseColors];

    for (let i = baseColors.length; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }

    return colors;
};

const SectorAllocation = ({ apiEndpoint, title = 'Sector Allocation' }) => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(apiEndpoint);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();

                if (!data.sectors || data.sectors.length === 0) {
                    setError('No sector allocation data available');
                    setChartData(null);
                    return;
                }

                // Sort sectors by percentage (descending)
                const sortedSectors = [...data.sectors].sort((a, b) => b.percentage - a.percentage);

                // Generate colors for each sector
                const colors = generateColors(sortedSectors.length);

                // Prepare chart data
                const chartDataConfig = {
                    labels: sortedSectors.map(sector => sector.sector),
                    datasets: [
                        {
                            data: sortedSectors.map(sector => sector.percentage),
                            backgroundColor: colors,
                            borderColor: colors.map(color => color.replace('0.7', '1')),
                            borderWidth: 1
                        }
                    ]
                };

                setChartData(chartDataConfig);
            } catch (err) {
                console.error('Error fetching sector allocation data:', err);
                setError('Failed to load sector allocation data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [apiEndpoint]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        return `${context.label}: ${value.toFixed(2)}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>

            <div style={{ height: '300px', position: 'relative' }}>
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
                    <Pie data={chartData} options={chartOptions} />
                )}
            </div>

            {!isLoading && !error && chartData && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {chartData.labels.map((label, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className="w-3 h-3 mr-2 rounded-full"
                                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                            ></div>
                            <span className="text-sm">{label}: {chartData.datasets[0].data[index].toFixed(2)}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SectorAllocation; 