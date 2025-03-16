'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'PHA', path: '/' },
        { name: 'Fund Analysis', path: '/fund-analysis' },
        { name: 'Holdings', path: '/holdings' },
        { name: 'Transactions', path: '/transactions' }
    ];

    // Function to determine if a nav item should be highlighted
    const isActive = (path: string) => {
        if (path === '/' && (pathname === '/' || pathname === '/portfolio')) {
            return true;
        }
        return pathname === path;
    };

    return (
        <div className="w-64 bg-gray-900 text-white h-screen flex flex-col border-r border-gray-800">
            <div className="p-4 border-b border-gray-800">
                <Link href="/" className="text-2xl font-bold text-blue-500">d</Link>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.path}
                                className={`flex items-center px-4 py-2 rounded-md ${isActive(item.path)
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
} 