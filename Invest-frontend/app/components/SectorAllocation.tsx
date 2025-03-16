'use client';

import { useState, useEffect } from 'react';
import { portfolioAPI } from '@/utils/api';

interface SectorData {
    name: string;
    value: number;
    percentage: number;
}

interface SectorAllocationProps {
    sectorData?: SectorData[] | null;
}

export default function SectorAllocation({ sectorData }: SectorAllocationProps) {
    const [sectors, setSectors] = useState<SectorData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchSectorData() {
            setIsLoading(true);
            try {
                const data = await portfolioAPI.getSectorAllocation();
                if (data && Array.isArray(data)) {
                    setSectors(data);
                }
            } catch (error) {
                console.error('Error fetching sector data:', error);
                setSectors([]);
            } finally {
                setIsLoading(false);
            }
        }

        // If sectorData is provided, use it; otherwise fetch from API
        if (sectorData) {
            setSectors(sectorData);
        } else {
            fetchSectorData();
        }
    }, [sectorData]);

    return (
        <div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-white">Loading sector data...</p>
                </div>
            ) : sectors.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-white">No sector data available</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* First row - Financial and Healthcare */}
                    <div className="flex gap-4">
                        <div className="flex-grow bg-blue-100/20 rounded-lg p-4">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-white">Financial</p>
                                <p className="text-xs text-gray-400">₹1,95,000</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-white">34%</p>
                            </div>
                        </div>
                        <div className="w-1/3 bg-blue-100/20 rounded-lg p-4">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-white">Healthcare</p>
                                <p className="text-xs text-gray-400">₹83,250</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-white">14.5%</p>
                            </div>
                        </div>
                    </div>

                    {/* Second row - Technology, Consumer Goods, Energy, Other Sectors */}
                    <div className="flex gap-4">
                        <div className="w-2/5 bg-blue-100/20 rounded-lg p-4">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-white">Technology</p>
                                <p className="text-xs text-gray-400">₹1,11,000</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-white">19%</p>
                            </div>
                        </div>
                        <div className="w-1/5 bg-blue-100/20 rounded-lg p-4">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-white">Consumer Goods</p>
                                <p className="text-xs text-gray-400">₹55,500</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-white">9.5%</p>
                            </div>
                        </div>
                        <div className="w-1/5 bg-blue-100/20 rounded-lg p-4">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-white">Energy</p>
                                <p className="text-xs text-gray-400">₹55,500</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-white">9.5%</p>
                            </div>
                        </div>
                        <div className="w-1/5 bg-blue-100/20 rounded-lg p-4">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-white">Other Sectors</p>
                                <p className="text-xs text-gray-400">₹55,500</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-white">9.5%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 