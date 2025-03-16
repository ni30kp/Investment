# InvestWelth Backend API

This is the backend API for the InvestWelth investment dashboard application. It provides endpoints for accessing investment data, portfolio information, fund details, and more.

## Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL)

## API Endpoints

### Users
- `GET /api/users/profile` - Get user profile

### Investments
- `GET /api/investments` - Get all investments
- `GET /api/investments/summary` - Get investment summary

### Funds
- `GET /api/funds` - Get all funds
- `GET /api/funds/overlap` - Get fund overlap analysis

### Portfolio
- `GET /api/portfolio` - Get portfolio data
- `GET /api/portfolio/sectors` - Get sector allocation

### Transactions
- `GET /api/transactions` - Get all transactions

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Supabase account

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   SUPABASE_URL=https://yfzgwczxiurosscswedy.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmemd3Y3p4aXVyb3NzY3N3ZWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMzc1ODksImV4cCI6MjA1NzYxMzU4OX0.YtDEXLoZn2TWOtqv4Wdj7CC9-Su35szkviBz0eK4kRQ
   DATABASE_URL=postgresql://postgres:#878WXx_FDa@&Ue@db.yfzgwczxiurosscswedy.supabase.co:5432/postgres
   PORT=5000
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The API will be available at http://localhost:5000. 