#!/bin/bash

# Check if PSQL is installed
if ! command -v psql &> /dev/null; then
  echo "PostgreSQL client (psql) is not installed. Please install it first."
  exit 1
fi

# Database connection details
DB_URL="postgresql://postgres:#878WXx_FDa@&Ue@db.yfzgwczxiurosscswedy.supabase.co:5432/postgres"

# Run the schema SQL file
echo "Initializing database schema..."
psql "$DB_URL" -f supabase/schema.sql

echo "Database initialization completed." 