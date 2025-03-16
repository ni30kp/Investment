#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the Invest-backend directory
if [[ ! -d "./scripts" ]]; then
    echo -e "${RED}Error: This script must be run from the Invest-backend directory${NC}"
    echo "Please cd to the Invest-backend directory and try again"
    exit 1
fi

# Check if .env file exists
if [[ ! -f "./.env" ]]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with your Supabase credentials"
    exit 1
fi

# Source the .env file to get Supabase credentials
source ./.env

# Check if SUPABASE_URL and SUPABASE_KEY are set
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_KEY" ]]; then
    echo -e "${RED}Error: SUPABASE_URL or SUPABASE_KEY not found in .env file${NC}"
    echo "Please add these variables to your .env file"
    exit 1
fi

echo -e "${YELLOW}Setting up fund overlap data in Supabase...${NC}"

# Use psql to run the SQL script
# Note: This requires the psql client to be installed
# You may need to adjust this command based on your Supabase setup
if command -v psql &> /dev/null; then
    # Extract database info from SUPABASE_URL
    # Format is typically: https://[project-ref].supabase.co
    PROJECT_REF=$(echo $SUPABASE_URL | sed -E 's/https:\/\/([^.]+).supabase.co.*/\1/')
    
    if [[ -z "$PROJECT_REF" ]]; then
        echo -e "${RED}Error: Could not extract project reference from SUPABASE_URL${NC}"
        echo "Please check your SUPABASE_URL format"
        exit 1
    fi
    
    echo -e "${YELLOW}Running SQL script...${NC}"
    
    # Option 1: If you have direct database access
    # Replace these with your actual database connection details
    # psql "postgres://postgres:[DB_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" -f ./scripts/fund-overlap-data.sql
    
    # Option 2: Use Supabase CLI (if installed)
    if command -v supabase &> /dev/null; then
        echo -e "${YELLOW}Using Supabase CLI to run SQL script...${NC}"
        supabase db execute --file ./scripts/fund-overlap-data.sql
    else
        echo -e "${RED}Error: Neither direct database access nor Supabase CLI is configured${NC}"
        echo -e "${YELLOW}Please run the SQL script manually using the Supabase dashboard SQL editor${NC}"
        echo "The SQL script is located at: ./scripts/fund-overlap-data.sql"
        exit 1
    fi
else
    echo -e "${RED}Error: psql command not found${NC}"
    echo -e "${YELLOW}Please run the SQL script manually using the Supabase dashboard SQL editor${NC}"
    echo "The SQL script is located at: ./scripts/fund-overlap-data.sql"
    exit 1
fi

echo -e "${GREEN}Fund overlap data setup complete!${NC}"
echo "You can now use the /api/funds/overlap endpoint to get fund overlap data"
exit 0 