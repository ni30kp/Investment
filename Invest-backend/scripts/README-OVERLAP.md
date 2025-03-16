# Setting Up Fund Overlap Analysis

This document provides instructions on how to set up the database for the Fund Overlap Analysis feature.

## Option 1: Using the Supabase Dashboard SQL Editor

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `simplified-fund-overlap.sql` into the SQL Editor
4. Run the SQL script

This will create a function called `get_fund_overlap` that returns sample data for demonstration purposes.

## Option 2: Using the Full Database Setup

If you have direct database access, you can run the full setup script:

1. Make sure you have PostgreSQL client tools installed
2. Run the following command:
   ```
   psql -U <your_db_user> -d <your_db_name> -f scripts/fund-overlap-data.sql
   ```

This will create the necessary tables, populate them with sample data, and create the `get_fund_overlap` function.

## Testing the Setup

To test if the setup was successful, you can run the following SQL query in the Supabase dashboard:

```sql
SELECT * FROM get_fund_overlap(1, 2);
```

This should return a row with sample overlap data between fund IDs 1 and 2.

## API Usage

Once the database is set up, you can use the `/api/funds/overlap` endpoint to get fund overlap data. You can specify the fund IDs using query parameters:

```
GET /api/funds/overlap?fund1=1&fund2=2
```

If no fund IDs are specified, the endpoint will default to fund IDs 1 and 2. 