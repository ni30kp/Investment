#!/bin/bash

# Set error handling
set -e

echo "===== InvestWelth Dependency Installation Script ====="
echo "This script will install all necessary dependencies for the InvestWelth project."
echo

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Function to install dependencies for a specific directory
install_dependencies() {
    local dir=$1
    local name=$2
    
    echo
    echo "===== Installing $name dependencies ====="
    
    if [ ! -d "$dir" ]; then
        echo "Error: $dir directory not found!"
        return 1
    fi
    
    cd "$dir"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "Error: package.json not found in $dir!"
        return 1
    fi
    
    echo "Checking for existing node_modules..."
    if [ -d "node_modules" ]; then
        echo "Existing node_modules found. Do you want to clean install? (y/n)"
        read -r answer
        if [[ "$answer" =~ ^[Yy]$ ]]; then
            echo "Removing existing node_modules..."
            rm -rf node_modules
            echo "Removing package-lock.json if it exists..."
            rm -f package-lock.json
        fi
    fi
    
    echo "Installing dependencies for $name..."
    npm install
    
    echo "$name dependencies installed successfully!"
    cd - > /dev/null
}

# Install backend dependencies
install_dependencies "Invest-backend" "Backend"

# Install frontend dependencies
install_dependencies "Invest-frontend" "Frontend"

echo
echo "===== All dependencies installed successfully! ====="
echo "You can now start the application using:"
echo "./start.sh" 