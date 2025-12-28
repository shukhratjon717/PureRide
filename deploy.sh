#!/bin/bash

# Stop script on any error
set -e

echo "Deploying PureRide API..."

# Go to project directory (adjust if needed)
cd /home/steve/Desktop/gittea/pure-ride/PureRide

# Reset local changes and pull latest code
git reset --hard
git checkout master
git pull origin master

# Install/update dependencies
npm install

# Build the project
npx nest build apps/pureride-api

# Restart PM2 process
pm2 restart pureride-api

# Save PM2 process list
pm2 save

echo "Deployment completed successfully!"
