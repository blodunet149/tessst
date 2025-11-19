#!/bin/bash

# D1 Setup Script for Cloudflare Workers Application

echo "Setting up Cloudflare D1 database for the application..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please run:"
    echo "wrangler login"
    exit 1
fi

# Create D1 database
DB_NAME="my-app-db"
echo "Creating D1 database: $DB_NAME"
wrangler d1 create "$DB_NAME"

if [ $? -eq 0 ]; then
    echo "✅ D1 database created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update your wrangler.json with the generated database ID"
    echo "2. Run 'wrangler d1 migrations apply $DB_NAME' to apply schema"
    echo "3. Deploy your application with 'npm run deploy'"
else
    echo "❌ Failed to create D1 database"
    exit 1
fi