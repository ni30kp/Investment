#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking and fixing investments tables...${NC}"

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
  echo -e "${RED}Error: This script must be run from the Invest-backend directory${NC}"
  echo "Current directory: $(pwd)"
  echo "Please run this script from the Invest-backend directory"
  exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js is not installed${NC}"
  echo "Please install Node.js and try again"
  exit 1
fi

# Run the check-investments-tables.js script
echo -e "${YELLOW}Running check-investments-tables.js...${NC}"
node scripts/check-investments-tables.js

# Check if the script ran successfully
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Investments tables have been checked and fixed successfully${NC}"
  echo -e "${GREEN}You can now use the investments API endpoints${NC}"
  exit 0
else
  echo -e "${RED}Failed to check and fix investments tables${NC}"
  echo "Please check the error messages above and try again"
  exit 1
fi 