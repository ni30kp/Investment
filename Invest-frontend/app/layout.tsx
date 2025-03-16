import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'InvestWelth - Investment Dashboard',
    description: 'Track and analyze your investments with InvestWelth',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen bg-background">
                    {children}
                </div>
            </body>
        </html>
    );
} 