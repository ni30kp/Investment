import { cookies } from 'next/headers';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Import API functions
import { investmentAPI } from '@/utils/api';

export default async function Holdings() {
    // Fetch holdings data from API
    let holdingsData;
    try {
        holdingsData = await investmentAPI.getAll();
        console.log('Holdings data:', holdingsData);
    } catch (error) {
        console.error('Error fetching holdings:', error);
        holdingsData = [];
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <Header />

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Holdings</h1>
                </div>

                <div className="bg-card rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-4">Your Investments</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4">Fund Name</th>
                                    <th className="text-left py-3 px-4">Type</th>
                                    <th className="text-right py-3 px-4">NAV</th>
                                    <th className="text-right py-3 px-4">Current Value</th>
                                    <th className="text-right py-3 px-4">Invested Amount</th>
                                    <th className="text-right py-3 px-4">Gain/Loss</th>
                                    <th className="text-right py-3 px-4">Returns %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdingsData && holdingsData.length > 0 ? (
                                    holdingsData.map((holding) => {
                                        // Safely access properties with null checks
                                        const currentValue = holding.currentValue || 0;
                                        const amountInvested = holding.amountInvested || 0;
                                        const gainLoss = currentValue - amountInvested;
                                        const returns = holding.returns || 0;

                                        return (
                                            <tr key={holding.id} className="border-b border-gray-800 hover:bg-gray-800">
                                                <td className="py-3 px-4">{holding.fundName || 'Unknown Fund'}</td>
                                                <td className="py-3 px-4">{holding.fundType || 'Unknown'}</td>
                                                <td className="py-3 px-4 text-right">₹{(holding.nav || 0).toFixed(2)}</td>
                                                <td className="py-3 px-4 text-right">₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                                <td className="py-3 px-4 text-right">₹{amountInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                                <td className={`py-3 px-4 text-right ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {gainLoss >= 0 ? '+' : ''}₹{gainLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                </td>
                                                <td className={`py-3 px-4 text-right ${returns >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {returns >= 0 ? '+' : ''}{returns.toFixed(2)}%
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-4 text-center text-gray-500">
                                            No investments found. Start investing to see your holdings here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
} 