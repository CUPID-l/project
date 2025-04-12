#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if git is installed
if ! command_exists git; then
    echo "Error: Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Check if remote exists
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "Adding remote repository..."
    git remote add origin https://github.com/CUPID-l/soil-zenith-grow-guide.git
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "Found uncommitted changes. Staging all files..."
    git add .
    
    echo "Committing changes..."
    git commit -m "Initial commit: Project setup with backend and frontend"
fi

# Check if main branch exists
if ! git show-ref --verify --quiet refs/heads/main; then
    echo "Creating main branch..."
    git branch -M main
fi

# Push to remote
echo "Pushing to remote repository..."
if git push -u origin main; then
    echo "Successfully pushed to remote repository!"
else
    echo "Error: Failed to push to remote repository."
    echo "Please check your internet connection and repository permissions."
    exit 1
fi 