require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreatePerformanceTables() {
    try {
        console.log('Checking performance tables...');

        // Check if portfolio_history table exists
        const { data: portfolioHistoryExists, error: portfolioHistoryError } = await supabase
            .from('portfolio_history')
            .select('history_id')
            .limit(1);

        if (portfolioHistoryError && portfolioHistoryError.code === '42P01') {
            console.log('portfolio_history table does not exist. Creating it...');

            // Read and execute monthly performance data SQL
            const monthlyPerformanceSQL = fs.readFileSync(
                path.join(__dirname, 'monthly-performance-data.sql'),
                'utf8'
            );

            // Execute the SQL using Supabase's rpc call
            const { error: createError } = await supabase.rpc('exec_sql', {
                sql_query: monthlyPerformanceSQL
            });

            if (createError) {
                console.error('Error creating tables from monthly-performance-data.sql:', createError);

                // Try creating tables one by one
                console.log('Trying to create tables individually...');

                // Create portfolio_history table
                await supabase.rpc('exec_sql', {
                    sql_query: `
            CREATE TABLE IF NOT EXISTS portfolio_history (
              history_id bigint primary key generated always as identity,
              user_id bigint REFERENCES users(user_id),
              value_date date NOT NULL,
              total_value numeric(14,2) NOT NULL,
              daily_change_percentage numeric(5,2),
              UNIQUE(user_id, value_date)
            );
          `
                });

                // Create fund_history table
                await supabase.rpc('exec_sql', {
                    sql_query: `
            CREATE TABLE IF NOT EXISTS fund_history (
              history_id bigint primary key generated always as identity,
              fund_id bigint REFERENCES mutual_funds(fund_id),
              value_date date NOT NULL,
              nav numeric(10,2) NOT NULL,
              daily_change_percentage numeric(5,2),
              UNIQUE(fund_id, value_date)
            );
          `
                });

                // Create portfolio_daily table
                await supabase.rpc('exec_sql', {
                    sql_query: `
            CREATE TABLE IF NOT EXISTS portfolio_daily (
              history_id bigint primary key generated always as identity,
              user_id bigint REFERENCES users(user_id),
              value_date date NOT NULL,
              total_value numeric(14,2) NOT NULL,
              daily_change_percentage numeric(5,2),
              UNIQUE(user_id, value_date)
            );
          `
                });

                console.log('Tables created individually.');
            } else {
                console.log('Tables created successfully from monthly-performance-data.sql');
            }

            // Check if we need to insert sample data
            const { data: portfolioHistoryCount, error: countError } = await supabase
                .from('portfolio_history')
                .select('history_id', { count: 'exact', head: true });

            if (!countError && portfolioHistoryCount === 0) {
                console.log('Inserting sample performance data...');

                // Insert sample data from monthly-performance-data.sql
                // This is a simplified approach - in a real app, you'd parse the SQL file
                // and execute only the INSERT statements

                // Insert sample data for user_id = 3 (Nitish Kumar)
                for (let month = 1; month <= 12; month++) {
                    const date = new Date(2024, month - 1, month === 2 ? 29 : 30);
                    const value = 300000 + (month * 5000);
                    const change = (Math.random() * 2 - 0.5).toFixed(2);

                    await supabase
                        .from('portfolio_history')
                        .insert({
                            user_id: 3,
                            value_date: date.toISOString().split('T')[0],
                            total_value: value,
                            daily_change_percentage: change
                        });
                }

                // Insert daily data for February 2025
                for (let day = 1; day <= 28; day++) {
                    const date = new Date(2025, 1, day);
                    const baseValue = 350000;
                    const fluctuation = Math.sin(day / 5) * 5000;
                    const value = baseValue + fluctuation;
                    const change = (Math.sin(day / 5) * 0.5).toFixed(2);

                    await supabase
                        .from('portfolio_daily')
                        .insert({
                            user_id: 3,
                            value_date: date.toISOString().split('T')[0],
                            total_value: value,
                            daily_change_percentage: change
                        });
                }

                console.log('Sample performance data inserted.');
            }
        } else {
            console.log('Performance tables already exist.');
        }

        console.log('Performance tables check completed.');
        return true;
    } catch (error) {
        console.error('Error checking/creating performance tables:', error);
        return false;
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    checkAndCreatePerformanceTables()
        .then(success => {
            if (success) {
                console.log('Performance tables setup completed successfully.');
                process.exit(0);
            } else {
                console.error('Performance tables setup failed.');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { checkAndCreatePerformanceTables }; 