#!/bin/bash

# Set error handling
set -e

echo "===== InvestWelth Setup Script ====="
echo "This script will guide you through setting up the InvestWelth project."
echo

# Function to display menu and get user choice
show_menu() {
    echo "Please select an option:"
    echo "1. Install dependencies"
    echo "2. Set up database"
    echo "3. Check backend"
    echo "4. Check frontend"
    echo "5. Start application"
    echo "6. Run all setup steps (1-2-5)"
    echo "7. Exit"
    echo
    read -p "Enter your choice (1-7): " choice
    echo
    
    case $choice in
        1)
            ./install-dependencies.sh
            ;;
        2)
            ./setup-database.sh
            ;;
        3)
            ./check-backend.sh
            ;;
        4)
            ./check-frontend.sh
            ;;
        5)
            ./start.sh
            ;;
        6)
            echo "Running all setup steps..."
            ./install-dependencies.sh
            ./setup-database.sh
            ./start.sh
            ;;
        7)
            echo "Exiting setup script."
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
    
    # Return to menu after completing the selected action
    echo
    echo "Press Enter to return to the menu..."
    read
    show_menu
}

# Check if all required scripts exist
check_scripts() {
    local missing_scripts=()
    
    for script in "install-dependencies.sh" "setup-database.sh" "check-backend.sh" "check-frontend.sh" "start.sh"; do
        if [ ! -f "$script" ]; then
            missing_scripts+=("$script")
        elif [ ! -x "$script" ]; then
            echo "Making $script executable..."
            chmod +x "$script"
        fi
    done
    
    if [ ${#missing_scripts[@]} -gt 0 ]; then
        echo "Error: The following required scripts are missing:"
        for script in "${missing_scripts[@]}"; do
            echo "  - $script"
        done
        echo "Please ensure all required scripts are present before running this setup script."
        exit 1
    fi
}

# Check if scripts exist
check_scripts

# Show the menu
show_menu