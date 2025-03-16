#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting InvestWelth Development Environment${NC}"
echo -e "${YELLOW}=======================================${NC}"

# Check if the backend directory exists
if [ ! -d "Invest-backend" ]; then
  echo -e "${RED}Error: Invest-backend directory not found${NC}"
  echo "Please make sure you're running this script from the project root directory."
  exit 1
fi

# Check if the frontend directory exists
if [ ! -d "Invest-frontend" ]; then
  echo -e "${RED}Error: Invest-frontend directory not found${NC}"
  echo "Please make sure you're running this script from the project root directory."
  exit 1
fi

# Function to check if a port is in use
is_port_in_use() {
  lsof -i:"$1" >/dev/null 2>&1
  return $?
}

# Check if ports are already in use
if is_port_in_use 5001; then
  echo -e "${RED}Error: Port 5001 is already in use. Backend server cannot start.${NC}"
  echo "Please stop any service using port 5001 and try again."
  exit 1
fi

if is_port_in_use 3000; then
  echo -e "${RED}Error: Port 3000 is already in use. Frontend server cannot start.${NC}"
  echo "Please stop any service using port 3000 and try again."
  exit 1
fi

# Check if performance data tables exist
echo -e "${YELLOW}Checking performance data tables...${NC}"
cd Invest-backend
./scripts/fix-performance-data.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to check performance data tables.${NC}"
  echo "Please run the fix-performance-data.sh script manually and try again."
  exit 1
fi

# Check if investments tables exist
echo -e "${YELLOW}Checking investments tables...${NC}"
./scripts/fix-investments-tables.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to check investments tables.${NC}"
  echo "Please run the fix-investments-tables.sh script manually and try again."
  exit 1
fi

cd ..

# Start the backend server in the background
echo -e "${YELLOW}Starting backend server...${NC}"
cd Invest-backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend server to start...${NC}"
sleep 5

# Check if backend started successfully
if ! is_port_in_use 5001; then
  echo -e "${RED}Error: Backend server failed to start${NC}"
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi

echo -e "${GREEN}Backend server started successfully on port 5001${NC}"

# Start the frontend server in the background
echo -e "${YELLOW}Starting frontend server...${NC}"
cd Invest-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend server to start...${NC}"
sleep 10

# Check if frontend started successfully
if ! is_port_in_use 3000; then
  echo -e "${RED}Error: Frontend server failed to start${NC}"
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  exit 1
fi

echo -e "${GREEN}Frontend server started successfully on port 3000${NC}"

# Print access information
echo -e "\n${GREEN}InvestWelth Development Environment is now running!${NC}"
echo -e "Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "Backend API: ${GREEN}http://localhost:5001/api${NC}"
echo -e "Portfolio Health Page: ${GREEN}http://localhost:3000/portfolio-health${NC}"
echo -e "\nPress Ctrl+C to stop both servers\n"

# Trap Ctrl+C to kill both processes
trap "echo -e '\n${YELLOW}Stopping servers...${NC}'; kill $BACKEND_PID 2>/dev/null; kill $FRONTEND_PID 2>/dev/null; echo -e '${GREEN}Servers stopped${NC}'; exit 0" INT

# Wait for both processes
wait 