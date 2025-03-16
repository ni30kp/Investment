#!/bin/bash

# Check if the frontend is running
echo "Checking if the frontend is running..."
if curl -s http://localhost:3000 > /dev/null; then
  echo "Frontend is running correctly!"
  
  # Check if key pages are accessible
  echo "Testing homepage..."
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "Homepage is accessible!"
  else
    echo "Homepage is not accessible."
  fi
  
  echo "Testing dashboard page..."
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard | grep -q "200"; then
    echo "Dashboard page is accessible!"
  else
    echo "Dashboard page is not accessible."
  fi
  
  echo "Testing investments page..."
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/investments | grep -q "200"; then
    echo "Investments page is accessible!"
  else
    echo "Investments page is not accessible."
  fi
  
  echo "Testing portfolio page..."
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/portfolio | grep -q "200"; then
    echo "Portfolio page is accessible!"
  else
    echo "Portfolio page is not accessible."
  fi
else
  echo "Frontend is not running or not accessible."
  echo "Please check the frontend logs for errors."
fi