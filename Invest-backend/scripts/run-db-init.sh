#!/bin/bash

# Set error handling
set -e

echo "===== InvestWelth Database Initialization ====="
echo "This script will initialize the database with schema and sample data."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if the init-db.js file exists
if [ ! -f "scripts/init-db.js" ]; then
    echo "Error: init-db.js file not found in the scripts directory!"
    exit 1
fi

# Check if the schema.sql file exists
if [ ! -f "scripts/schema.sql" ]; then
    echo "Error: schema.sql file not found in the scripts directory!"
    exit 1
fi

# Check if the sample-data.sql file exists
if [ ! -f "scripts/sample-data.sql" ]; then
    echo "Error: sample-data.sql file not found in the scripts directory!"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with your Supabase credentials."
    exit 1
fi

# Run the initialization script
echo "Running database initialization script..."
node scripts/init-db.js

echo
echo "===== Database initialization completed! =====" 