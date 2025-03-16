#!/bin/bash

# Exit on any error
set -e

# Function to handle script termination
cleanup() {
  echo "Stopping servers..."
  if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
  fi
  exit 0
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM EXIT

# Start the backend server
echo "Starting the backend server..."
cd Invest-backend
npm install
echo "Installing backend dependencies completed."

# Check if port 5001 is already in use
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
  echo "Port 5001 is already in use. Please free up this port and try again."
  exit 1
fi

# Start the backend server
echo "Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for the backend to start
echo "Waiting for the backend to start..."
sleep 5

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
  echo "Backend server failed to start. Check the logs for errors."
  exit 1
fi

# Start the frontend server
echo "Starting the frontend server..."
cd ../Invest-frontend
npm install
echo "Installing frontend dependencies completed."

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  echo "Port 3000 is already in use. Please free up this port and try again."
  exit 1
fi

# Start the frontend server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait for the frontend to start
echo "Waiting for the frontend to start..."
sleep 5

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
  echo "Frontend server failed to start. Check the logs for errors."
  exit 1
fi

echo "Both servers are running."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5001"
echo "Press Ctrl+C to stop."

# Keep the script running
wait $BACKEND_PID $FRONTEND_PID