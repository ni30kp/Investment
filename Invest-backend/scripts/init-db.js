require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');

        // Read the SQL file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sampleDataPath = path.join(__dirname, 'sample-data.sql');

        let schemaSQL = '';
        let sampleDataSQL = '';

        // Check if schema file exists
        if (fs.existsSync(schemaPath)) {
            schemaSQL = fs.readFileSync(schemaPath, 'utf8');
            console.log('Schema SQL file loaded successfully.');
        } else {
            console.log('Schema SQL file not found. Skipping schema creation.');
        }

        // Check if sample data file exists
        if (fs.existsSync(sampleDataPath)) {
            sampleDataSQL = fs.readFileSync(sampleDataPath, 'utf8');
            console.log('Sample data SQL file loaded successfully.');
        } else {
            console.error('Sample data SQL file not found!');
            process.exit(1);
        }

        // Execute schema SQL if it exists
        if (schemaSQL) {
            console.log('Creating database schema...');
            const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSQL });

            if (schemaError) {
                console.error('Error creating schema:', schemaError);
                process.exit(1);
            }

            console.log('Database schema created successfully.');
        }

        // Execute sample data SQL
        console.log('Inserting sample data...');

        // Split the SQL into individual statements
        const statements = sampleDataSQL
            .replace(/--.*$/gm, '') // Remove comments
            .split(';')
            .filter(statement => statement.trim() !== '');

        // Execute each statement separately
        for (const statement of statements) {
            const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

            if (error) {
                console.error('Error executing statement:', error);
                console.error('Statement:', statement);
                // Continue with other statements even if one fails
            }
        }

        console.log('Sample data inserted successfully.');
        console.log('Database initialization completed!');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase(); 