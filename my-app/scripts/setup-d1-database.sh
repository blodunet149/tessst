#!/bin/bash

# Script to help set up Cloudflare D1 database for the application

echo "Setting up Cloudflare D1 database for the application..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Error: wrangler is not installed. Please install it with 'npm install -g wrangler' or 'npm install wrangler'"
    exit 1
fi

# Check if logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "You are not logged in to Cloudflare. Logging in now..."
    wrangler login
fi

# Create D1 database
echo "Creating D1 database..."
DATABASE_NAME="my-app-db-$(date +%s)"  # Add timestamp to make it unique
wrangler d1 create "$DATABASE_NAME"

if [ $? -ne 0 ]; then
    echo "Error creating D1 database. Please check your Cloudflare account and wrangler configuration."
    exit 1
fi

echo "Database '$DATABASE_NAME' created successfully!"

# Update wrangler.jsonc with the new database ID
echo "Updating wrangler configuration with the new database ID..."

# Get the database ID from the list of databases
DB_ID=$(wrangler d1 list | grep "$DATABASE_NAME" | awk '{print $1}')

if [ -z "$DB_ID" ]; then
    echo "Error: Could not retrieve database ID. Please update wrangler.jsonc manually."
    exit 1
fi

# Update the wrangler.jsonc file
sed -i "s/\"database_id\": \"YOUR_DATABASE_ID_HERE\"/\"database_id\": \"$DB_ID\"/g" wrangler.jsonc

if [ $? -ne 0 ]; then
    echo "Error: Could not update wrangler.jsonc. Please update the database_id manually."
    exit 1
fi

echo "Updated wrangler.jsonc with database ID: $DB_ID"

# Apply migrations
echo "Applying database migrations..."
wrangler d1 migrations apply "$DATABASE_NAME"

if [ $? -ne 0 ]; then
    echo "Error applying migrations. Please check your migration files."
    exit 1
fi

echo "Database setup completed successfully!"
echo "Your D1 database '$DATABASE_NAME' (ID: $DB_ID) is ready to use."
echo "You can now deploy your application with 'npm run deploy'."