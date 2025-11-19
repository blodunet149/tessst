# Setting up Cloudflare D1 Database

This guide explains how to set up the Cloudflare D1 database for your application.

## Prerequisites

- Node.js installed on your machine
- Wrangler CLI installed (`npm install -g wrangler`)
- Cloudflare account with Workers & D1 enabled

## Step-by-step Setup

### 1. Install Dependencies

```bash
cd my-app
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
wrangler d1 create my-app-db
```

This command will create a new D1 database and output the database ID.

### 4. Update Configuration

Update the `wrangler.jsonc` file with your actual database ID:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-app-db",
      "database_id": "YOUR_ACTUAL_DATABASE_ID"  // Replace with the ID from step 3
    }
  ]
}
```

### 5. Apply Database Migrations

```bash
wrangler d1 migrations apply my-app-db
```

This command will apply all migration files in the `migrations/` directory to set up the database schema.

### 6. Deploy Your Application

```bash
npm run deploy
```

## Alternative: Using the Setup Script

Alternatively, you can run the automated setup script:

```bash
chmod +x scripts/setup-d1-database.sh
./scripts/setup-d1-database.sh
```

This script will:
- Verify wrangler installation
- Login to Cloudflare if needed
- Create a new D1 database
- Update your wrangler configuration
- Apply database migrations

## Database Schema

The application uses the following tables:

### users
- `id` (TEXT, PRIMARY KEY) - Unique user identifier
- `email` (TEXT, UNIQUE) - User's email address
- `password` (TEXT) - User's password (should be hashed in production)
- `firstName` (TEXT) - User's first name
- `lastName` (TEXT) - User's last name
- `createdAt` (TEXT) - Account creation timestamp

### sessions
- `id` (TEXT, PRIMARY KEY) - Session token
- `user_id` (TEXT) - Reference to the user who owns the session
- `created_at` (TEXT) - Session creation timestamp  
- `expires_at` (TEXT) - Session expiration time

### orders
- `id` (TEXT, PRIMARY KEY) - Unique order identifier
- `user_id` (TEXT) - Reference to the user who placed the order
- `items` (TEXT) - JSON string of order items
- `total_amount` (REAL) - Total order cost
- `delivery_address` (TEXT) - Delivery address
- `payment_method` (TEXT) - Payment method
- `status` (TEXT) - Order status (default: 'pending')
- `created_at` (TEXT) - Order creation timestamp
- `updated_at` (TEXT) - Order last updated timestamp

## Security Notes

- Passwords are stored as plain text in this demo (not suitable for production)
- In a production environment, always hash passwords using bcrypt or similar
- Use HTTPS in production to protect session tokens
- Implement rate limiting for authentication endpoints