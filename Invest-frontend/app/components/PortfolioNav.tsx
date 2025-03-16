'use client';

import { useState } from 'react';

export default function PortfolioNav() {
    const [activeTab, setActiveTab] = useState('performance');

    return (
        <div className="mb-6">
            <div className="flex border-b border-gray-700">
                <TabButton
                    label="Performance Metrics"
                    isActive={activeTab === 'performance'}
                    onClick={() => setActiveTab('performance')}
                />
                <TabButton
                    label="Portfolio Composition"
                    isActive={activeTab === 'composition'}
                    onClick={() => setActiveTab('composition')}
                />
            </div>
        </div>
    );
}

function TabButton({
    label,
    isActive,
    onClick
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className={`py-3 px-6 font-medium ${isActive
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
} 