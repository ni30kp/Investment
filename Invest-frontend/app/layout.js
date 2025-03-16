import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'InvestWelth - Mutual Fund Investment Platform',
    description: 'Track and manage your mutual fund investments with InvestWelth',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-50 min-h-screen`}>
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="text-2xl font-bold text-blue-600">
                                InvestWelth
                            </Link>

                            <nav className="hidden md:flex space-x-8">
                                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                                    Dashboard
                                </Link>
                                <Link href="/funds" className="text-gray-700 hover:text-blue-600 font-medium">
                                    Explore Funds
                                </Link>
                                <Link href="/portfolio-health" className="text-gray-700 hover:text-blue-600 font-medium">
                                    Portfolio Health
                                </Link>
                                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                                    Profile
                                </Link>
                            </nav>

                            <div className="md:hidden">
                                {/* Mobile menu button - in a real app, this would toggle a mobile menu */}
                                <button className="text-gray-700 hover:text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main>
                    {children}
                </main>

                <footer className="bg-white border-t mt-12 py-8">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">InvestWelth</h3>
                                <p className="text-gray-600">
                                    Your trusted platform for mutual fund investments and portfolio tracking.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/funds" className="text-gray-600 hover:text-blue-600">
                                            Explore Funds
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/portfolio-health" className="text-gray-600 hover:text-blue-600">
                                            Portfolio Health
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                                            Profile
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="#" className="text-gray-600 hover:text-blue-600">
                                            Investment Guides
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-600 hover:text-blue-600">
                                            Market News
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-600 hover:text-blue-600">
                                            FAQs
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>Email: support@investwelth.com</li>
                                    <li>Phone: +91 123 456 7890</li>
                                    <li>Address: Mumbai, India</li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t mt-8 pt-8 text-center text-gray-600">
                            <p>&copy; {new Date().getFullYear()} InvestWelth. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
} 