'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { user, profile, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
                {/* Navigation links */}
                <nav className="flex space-x-6">
                    <a href="/" className="text-white hover:text-blue-400">Home</a>
                    <a href="/portfolio" className="text-white border-b-2 border-blue-500 pb-1">Portfolio</a>
                    <a href="/mutual-funds" className="text-white hover:text-blue-400">Mutual Funds</a>
                    <a href="/tools" className="text-white hover:text-blue-400">Tools</a>
                    <a href="/transactions" className="text-white hover:text-blue-400">Transactions</a>
                </nav>
            </div>

            <div className="flex items-center space-x-4">
                {/* Search icon */}
                <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {/* Notification icon */}
                <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>

                {/* User profile */}
                <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="font-medium text-white">
                            {profile ? getInitials(profile.full_name) : user?.email?.[0].toUpperCase() || 'U'}
                        </span>
                    </button>
                    {/* Signout button */}
                    <button
                        onClick={handleSignOut}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
} 