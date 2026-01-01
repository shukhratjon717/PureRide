#!/bin/bash

# =========================================
# PureRide Backend Auto-Deployment Script
# =========================================

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
APP_NAME="pureride-BE"                                   # PM2 process name
PROJECT_DIR="/home/steve/Desktop/gittea/pure-ride/PureRide"
GIT_BRANCH="main"                                    # Change to 'master' if your repo uses it
LOG_FILE="$PROJECT_DIR/deploy.log"

# Timestamp
echo "==============================================" | tee -a $LOG_FILE
echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting deployment..." | tee -a $LOG_FILE

# Go to project directory
cd $PROJECT_DIR

# Reset any local changes and pull latest code
echo "Resetting local changes and pulling latest code from GitHub..." | tee -a $LOG_FILE
git fetch origin $GIT_BRANCH | tee -a $LOG_FILE
git reset --hard origin/$GIT_BRANCH | tee -a $LOG_FILE

# Install/update dependencies
echo "Installing/updating dependencies..." | tee -a $LOG_FILE
npm install --production | tee -a $LOG_FILE

# Build the project
echo "Building the project..." | tee -a $LOG_FILE
npx nest build apps/pureride-api | tee -a $LOG_FILE

# Restart PM2 process (zero-downtime)
echo "Restarting PM2 process ($APP_NAME)..." | tee -a $LOG_FILE
pm2 reload $APP_NAME --update-env | tee -a $LOG_FILE

# Save PM2 process list
pm2 save | tee -a $LOG_FILE

# Done
echo "$(date '+%Y-%m-%d %H:%M:%S') - Deployment completed successfully!" | tee -a $LOG_FILE
echo "==============================================" | tee -a $LOG_FILE
