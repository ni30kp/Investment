# InvestWelth - Mutual Fund Investment Platform

InvestWelth is a comprehensive mutual fund investment tracking and analysis platform that helps users manage their investment portfolios, analyze fund performance, and make informed investment decisions.

## Features

- **Dashboard**: View your investment summary, portfolio performance, and recent transactions
- **Fund Explorer**: Discover and analyze mutual funds with detailed information on performance, holdings, and sector allocations
- **Portfolio Health Analysis**: Get insights into your portfolio's health with diversification, risk, and performance scores
- **User Profile**: Manage your personal information and investment preferences

## Tech Stack

### Frontend
- Next.js 14
- React 18
- Chart.js & React-Chartjs-2
- Tailwind CSS
- Supabase Client

### Backend
- Node.js
- Express.js
- PostgreSQL (via Supabase)
- Supabase for authentication and database

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/investwelth.git
   cd investwelth
   ```

2. Run the setup script:
   ```
   ./setup.sh
   ```
   
   This script will:
   - Install dependencies for both frontend and backend
   - Set up environment variables
   - Initialize the database with schema and sample data
   - Start both frontend and backend servers

### Development

For development, you can use the `run-dev.sh` script to start both the frontend and backend servers with a single command:

```
./run-dev.sh
```

This script will:
1. Check if the performance data tables exist and create them if needed
2. Start the backend server on port 5001
3. Start the frontend server on port 3000
4. Provide a single terminal interface to monitor both servers
5. Allow you to stop both servers with a single Ctrl+C command

### Manual Setup

If you prefer to set up manually:

1. Install dependencies:
   ```
   cd Invest-frontend
   npm install
   cd ../Invest-backend
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your Supabase credentials and other settings

3. Initialize the database:
   ```
   cd Invest-backend
   ./scripts/run-db-init.sh
   ```
   
   Alternatively, you can run the SQL scripts directly in the Supabase SQL Editor:
   - `scripts/schema.sql` - Creates the database schema
   - `scripts/sample-data.sql` - Inserts sample data
   - `scripts/monthly-performance-data.sql` - Adds monthly performance data
   - `scripts/daily-performance-data.sql` - Adds daily performance data

4. Start the servers:
   ```
   # In Invest-backend directory
   npm start
   
   # In Invest-frontend directory (in a new terminal)
   npm run dev
   ```

## Project Structure

```
InvestWelth/
├── Invest-frontend/       # Next.js frontend application
│   ├── app/               # Next.js app directory
│   │   ├── dashboard/     # Dashboard page
│   │   ├── funds/         # Fund explorer pages
│   │   ├── portfolio-health/ # Portfolio health analysis
│   │   └── profile/       # User profile page
│   ├── components/        # Reusable React components
│   ├── utils/             # Utility functions and API client
│   └── public/            # Static assets
│
├── Invest-backend/        # Express.js backend application
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── models/            # Data models
│   ├── scripts/           # Database scripts
│   └── middleware/        # Express middleware
│
└── scripts/               # Project setup and utility scripts
```

## API Endpoints

### User API
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Portfolio API
- `GET /api/portfolio` - Get user's portfolio summary
- `GET /api/portfolio/performance` - Get portfolio performance data
- `GET /api/portfolio/sectors` - Get portfolio sector allocation
- `GET /api/portfolio/health` - Get portfolio health analysis

### Funds API
- `GET /api/funds` - Get all mutual funds
- `GET /api/funds/:id` - Get fund details by ID
- `GET /api/funds/:id/performance` - Get fund performance data
- `GET /api/funds/:id/sectors` - Get fund sector allocation
- `GET /api/funds/:id/stocks` - Get fund stock holdings

### Investments API
- `GET /api/investments` - Get user's investments
- `POST /api/investments` - Add a new investment
- `PUT /api/investments/:id` - Update an investment
- `DELETE /api/investments/:id` - Delete an investment

## Troubleshooting

If you encounter any issues during setup or running the application, please refer to the `TROUBLESHOOTING.md` file for common problems and solutions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Supabase](https://supabase.io/) for authentication and database services
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Tailwind CSS](https://tailwindcss.com/) for styling 

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
PORT=3001 