require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixInvestmentsTables() {
    try {
        console.log('Checking investments tables...');

        // Check if user_investments table exists
        const { data: userInvestmentsExists, error: userInvestmentsError } = await supabase
            .from('user_investments')
            .select('investment_id')
            .limit(1);

        if (userInvestmentsError) {
            console.error('Error checking user_investments table:', userInvestmentsError);

            // Check if the table doesn't exist
            if (userInvestmentsError.code === '42P01') {
                console.log('user_investments table does not exist. Creating it...');

                // Create user_investments table
                await supabase.rpc('exec_sql', {
                    sql_query: `
            CREATE TABLE IF NOT EXISTS user_investments (
              investment_id bigint primary key generated always as identity,
              user_id bigint REFERENCES users(user_id),
              fund_id bigint REFERENCES mutual_funds(fund_id),
              amount_invested numeric(14,2) NOT NULL,
              investment_date date NOT NULL DEFAULT CURRENT_DATE,
              returns_since_investment numeric(6,2) DEFAULT 0
            );
          `
                });

                console.log('user_investments table created successfully.');
            }
        } else {
            console.log('user_investments table exists.');
        }

        // Check if there's a foreign key relationship between user_investments and mutual_funds
        const { data: fkData, error: fkError } = await supabase.rpc('exec_sql', {
            sql_query: `
        SELECT
          tc.constraint_name,
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM
          information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'user_investments'
          AND kcu.column_name = 'fund_id'
          AND ccu.table_name = 'mutual_funds';
      `
        });

        if (fkError) {
            console.error('Error checking foreign key relationship:', fkError);
        } else if (!fkData || fkData.length === 0) {
            console.log('Foreign key relationship between user_investments.fund_id and mutual_funds.fund_id does not exist. Creating it...');

            // Add foreign key constraint
            await supabase.rpc('exec_sql', {
                sql_query: `
          ALTER TABLE user_investments
          ADD CONSTRAINT fk_user_investments_mutual_funds
          FOREIGN KEY (fund_id)
          REFERENCES mutual_funds(fund_id);
        `
            });

            console.log('Foreign key relationship created successfully.');
        } else {
            console.log('Foreign key relationship exists.');
        }

        // Check if there's sample data in the user_investments table
        const { count, error: countError } = await supabase
            .from('user_investments')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('Error checking user_investments count:', countError);
        } else if (count === 0) {
            console.log('No data found in user_investments table. Adding sample data...');

            // Add sample data
            const { error: insertError } = await supabase
                .from('user_investments')
                .insert([
                    {
                        user_id: 3, // Nitish Kumar
                        fund_id: 1, // HDFC Top 100 Fund
                        amount_invested: 50000,
                        investment_date: '2024-01-15',
                        returns_since_investment: 8.5
                    },
                    {
                        user_id: 3, // Nitish Kumar
                        fund_id: 2, // Axis Bluechip Fund
                        amount_invested: 75000,
                        investment_date: '2024-02-10',
                        returns_since_investment: 7.2
                    },
                    {
                        user_id: 3, // Nitish Kumar
                        fund_id: 3, // SBI Small Cap Fund
                        amount_invested: 100000,
                        investment_date: '2023-11-05',
                        returns_since_investment: 12.8
                    }
                ]);

            if (insertError) {
                console.error('Error inserting sample data:', insertError);
            } else {
                console.log('Sample data added successfully.');
            }
        } else {
            console.log(`Found ${count} records in user_investments table.`);
        }

        console.log('Investments tables check completed.');
        return true;
    } catch (error) {
        console.error('Error checking/fixing investments tables:', error);
        return false;
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    checkAndFixInvestmentsTables()
        .then(success => {
            if (success) {
                console.log('Investments tables setup completed successfully.');
                process.exit(0);
            } else {
                console.error('Investments tables setup failed.');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { checkAndFixInvestmentsTables }; 