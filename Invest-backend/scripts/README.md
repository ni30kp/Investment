# Database Setup for InvestWelth

This directory contains scripts to set up and initialize the database for the InvestWelth application.

## Files

- `schema.sql`: Contains the SQL statements to create the database tables and relationships.
- `sample-data.sql`: Contains sample data to populate the database tables.
- `init-db.js`: JavaScript script to execute the SQL files against the Supabase database.

## Setting Up the Database

### Prerequisites

- Supabase account and project
- Supabase URL and anon key in the `.env` file

### Using the Setup Script

1. Make sure your Supabase credentials are correctly set in the `.env` file:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_url
   ```

2. Run the initialization script:
   ```bash
   cd Invest-backend
   node scripts/init-db.js
   ```

### Manual Setup

If you prefer to set up the database manually:

1. Log in to your Supabase dashboard.
2. Go to the SQL Editor.
3. Copy the contents of `schema.sql` and execute it to create the tables.
4. Copy the contents of `sample-data.sql` and execute it to insert sample data.

## Database Schema

The database consists of the following tables:

1. `users`: Stores user information.
2. `mutual_funds`: Stores information about mutual funds.
3. `user_investments`: Tracks user investments in mutual funds.
4. `sectors`: Lists different market sectors.
5. `fund_sector_allocations`: Maps funds to sectors with allocation percentages.
6. `stocks`: Lists stocks that mutual funds invest in.
7. `fund_stock_allocations`: Maps funds to stocks with allocation percentages.
8. `market_caps`: Lists different market capitalization categories.
9. `fund_market_cap_allocations`: Maps funds to market caps with allocation percentages.
10. `fund_overlaps`: Tracks overlap percentages between pairs of funds.

## Sample Data

The sample data includes:

- 3 users
- 6 mutual funds
- 10 sectors
- 15 stocks
- 3 market cap categories
- Various allocations and relationships between these entities

This sample data provides a realistic starting point for testing the application. 