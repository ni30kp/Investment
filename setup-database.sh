#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up database for InvestWelth...${NC}"

# Check if Invest-backend directory exists
if [ ! -d "Invest-backend" ]; then
  echo -e "${RED}Error: Invest-backend directory not found${NC}"
  echo "Please make sure you're running this script from the project root directory."
  exit 1
fi

# Check if .env file exists in Invest-backend
if [ ! -f "Invest-backend/.env" ]; then
  echo -e "${RED}Error: .env file not found in Invest-backend directory${NC}"
  echo "Please create a .env file with the required environment variables."
  exit 1
fi

# Source the .env file to get the database connection details
source Invest-backend/.env

# Check if the required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}Error: Required environment variables not set${NC}"
  echo "Please make sure SUPABASE_URL, SUPABASE_ANON_KEY, and DATABASE_URL are set in the .env file."
  exit 1
fi

echo -e "${GREEN}Database connection details found.${NC}"

# Ask if the user wants to initialize the database tables and sample data
read -p "Do you want to initialize the database tables and sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Initializing database tables and sample data...${NC}"
  
  # Check if the initialization script exists
  if [ -f "Invest-backend/scripts/run-db-init.sh" ]; then
    # Run the initialization script
    cd Invest-backend
    ./scripts/run-db-init.sh
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Database tables and sample data initialized successfully.${NC}"
    else
      echo -e "${RED}Failed to initialize database tables and sample data.${NC}"
      exit 1
    fi
    cd ..
  else
    echo -e "${RED}Error: Database initialization script not found at Invest-backend/scripts/run-db-init.sh${NC}"
    exit 1
  fi
fi

# Ask if the user wants to check and fix performance data tables
read -p "Do you want to check and fix performance data tables for charts? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Checking and fixing performance data tables...${NC}"
  
  # Check if the performance data script exists
  if [ -f "Invest-backend/scripts/fix-performance-data.sh" ]; then
    # Run the performance data script
    cd Invest-backend
    ./scripts/fix-performance-data.sh
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Performance data tables checked and fixed successfully.${NC}"
    else
      echo -e "${RED}Failed to check and fix performance data tables.${NC}"
      exit 1
    fi
    cd ..
  else
    echo -e "${RED}Error: Performance data script not found at Invest-backend/scripts/fix-performance-data.sh${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}Database setup completed successfully.${NC}"
exit 0 