#!/bin/bash

# Check if the backend is running
echo "Checking if the backend is running..."
if curl -s http://localhost:5001 > /dev/null; then
  echo "Backend is running correctly!"
  echo "Testing API endpoints..."
  
  # Test the API endpoints
  echo "Testing /api/users/profile..."
  curl -s http://localhost:5001/api/users/profile | jq || echo "Failed to get user profile"
  
  echo "Testing /api/investments..."
  curl -s http://localhost:5001/api/investments | jq || echo "Failed to get investments"
  
  echo "Testing /api/funds..."
  curl -s http://localhost:5001/api/funds | jq || echo "Failed to get funds"
  
  echo "Testing /api/portfolio..."
  curl -s http://localhost:5001/api/portfolio | jq || echo "Failed to get portfolio"
  
  echo "Testing /api/transactions..."
  curl -s http://localhost:5001/api/transactions | jq || echo "Failed to get transactions"
else
  echo "Backend is not running or not accessible."
  echo "Please check the backend logs for errors."
fi 