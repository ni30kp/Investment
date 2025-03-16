import { cookies } from 'next/headers';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Import API functions
import { transactionAPI } from '@/utils/api';

export default async function Transactions() {
    // Fetch transactions data from API
    let transactionsData;
    try {
        transactionsData = await transactionAPI.getAll();
        console.log('Transactions data:', transactionsData);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        transactionsData = [];
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <Header />

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Transactions</h1>
                </div>

                <div className="bg-card rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4">Date</th>
                                    <th className="text-left py-3 px-4">Fund Name</th>
                                    <th className="text-left py-3 px-4">Type</th>
                                    <th className="text-right py-3 px-4">Amount</th>
                                    <th className="text-right py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionsData && transactionsData.length > 0 ? (
                                    transactionsData.map((transaction) => {
                                        // Format the date safely
                                        let purchaseDate = 'Unknown Date';
                                        try {
                                            if (transaction.date || transaction.purchase_date) {
                                                purchaseDate = new Date(transaction.date || transaction.purchase_date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                });
                                            }
                                        } catch (e) {
                                            console.error('Error formatting date:', e);
                                        }

                                        return (
                                            <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800">
                                                <td className="py-3 px-4">{purchaseDate}</td>
                                                <td className="py-3 px-4">{transaction.fundName || transaction.fund_name || 'Unknown Fund'}</td>
                                                <td className="py-3 px-4">{transaction.type || 'Purchase'}</td>
                                                <td className="py-3 px-4 text-right">₹{(transaction.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className="px-2 py-1 rounded-full bg-green-900 text-green-300">
                                                        {transaction.status || 'Completed'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center text-gray-500">
                                            No transactions found. Start investing to see your transactions here.
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