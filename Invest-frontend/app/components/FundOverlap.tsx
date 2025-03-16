'use client';

interface OverlapData {
    funds: { id: number; name: string }[];
    stocksOverlap: number;
    averageOverlapPercentage: number;
    commonStocks: string[];
}

interface FundOverlapProps {
    overlapData?: OverlapData | null;
}

export default function FundOverlap({ overlapData }: FundOverlapProps) {
    // Default values if no data is provided
    const fund1 = overlapData?.funds?.[0]?.name || 'Motilal Large Cap Fund';
    const fund2 = overlapData?.funds?.[1]?.name || 'Nippon Large Cap Fund';
    const stocksOverlap = overlapData?.stocksOverlap || 'X';
    const averageOverlap = overlapData?.averageOverlapPercentage || 'Y%';
    const commonStocks = overlapData?.commonStocks || [
        'HDFC LTD.',
        'RIL',
        'INFY',
        'TCS',
        'HDFCBANK',
        'BHARTIARTL'
    ];

    return (
        <div className="bg-card rounded-lg p-4">
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold">Overlap Analysis</h2>
                <button className="ml-2 text-gray-400 hover:text-white">
                    <InfoIcon />
                </button>
            </div>

            <p className="text-gray-400 mb-2">Comparing : {fund1} and {fund2}</p>

            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><span className="font-bold">{stocksOverlap} Stocks Overlap</span> across these funds.</li>
                <li><span className="font-bold">{averageOverlap} Average Overlap</span> in holdings.</li>
            </ul>

            <div className="relative h-96">
                <div className="absolute inset-0 flex items-center">
                    {/* This would be a complex visualization in a real app */}
                    <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Fund Overlap Visualization</p>
                    </div>
                </div>

                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center space-y-4">
                    <FundLabel name={fund2} color="bg-yellow-700" />
                    <FundLabel name={fund1} color="bg-blue-700" />
                    <FundLabel name="HDFC Large Cap Fund" color="bg-yellow-900" />
                    <FundLabel name="ICICI Prudential Midcap Fund" color="bg-green-900" />
                </div>

                <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center space-y-4">
                    {commonStocks.map((stock) => (
                        <StockLabel key={stock} name={stock} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function FundLabel({ name, color }: { name: string; color: string }) {
    return (
        <div className="flex items-center">
            <div className={`w-32 h-12 ${color} rounded-lg flex items-center justify-center text-xs text-center p-2`}>
                {name}
            </div>
        </div>
    );
}

function StockLabel({ name }: { name: string }) {
    return (
        <div className="flex items-center">
            <div className="w-24 text-right">{name}</div>
        </div>
    );
}

function InfoIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
} 