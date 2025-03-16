/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1E40AF',
                secondary: '#3B82F6',
                background: '#111827',
                card: '#1F2937',
                text: {
                    primary: '#F9FAFB',
                    secondary: '#D1D5DB',
                },
                success: '#10B981',
                danger: '#EF4444',
            },
        },
    },
    plugins: [],
}; 