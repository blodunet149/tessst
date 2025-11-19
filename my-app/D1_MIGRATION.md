# Cloudflare D1 Migration Guide

This project has been migrated from Cloudflare KV to Cloudflare D1 database for persistent data storage.

## Changes Made

1. **Database Migration**: Replaced KV namespace with D1 database
2. **Schema Creation**: Created SQL schema for users, sessions, and orders tables
3. **API Updates**: Updated all API endpoints to use D1 queries instead of KV operations

## Database Schema

The following tables have been created in the D1 database:

### Users Table
- `id`: TEXT PRIMARY KEY - Unique user identifier
- `email`: TEXT UNIQUE - User's email address
- `password`: TEXT - User's password (should be hashed in production)
- `firstName`: TEXT - User's first name
- `lastName`: TEXT - User's last name
- `createdAt`: TEXT - Account creation timestamp

### Sessions Table
- `id`: TEXT PRIMARY KEY - Session token
- `user_id`: TEXT - Reference to the user who owns the session
- `created_at`: TEXT - Session creation timestamp
- `expires_at`: TEXT - Session expiration time

### Orders Table
- `id`: TEXT PRIMARY KEY - Unique order identifier
- `user_id`: TEXT - Reference to the user who placed the order
- `items`: TEXT - JSON string of order items
- `total_amount`: REAL - Total order cost
- `delivery_address`: TEXT - Delivery address
- `payment_method`: TEXT - Payment method
- `status`: TEXT - Order status (default: 'pending')
- `created_at`: TEXT - Order creation timestamp
- `updated_at`: TEXT - Order last updated timestamp

## Setup Instructions

Before deploying, you need to create and migrate your D1 database:

### Method 1: Manual Setup
1. **Create D1 Database**:
   ```bash
   wrangler d1 create my-app-db
   ```

2. **Update wrangler.jsonc with the generated database ID**:
   ```json
   {
     "d1_databases": [
       {
         "binding": "DB",
         "database_name": "my-app-db",
         "database_id": "YOUR_ACTUAL_DATABASE_ID"  // Replace with your actual database ID
       }
     ]
   }
   ```

3. **Apply Database Migrations**:
   ```bash
   wrangler d1 migrations apply my-app-db
   ```

4. **Deploy the application**:
   ```bash
   npm run deploy
   ```

### Method 2: Automated Setup
Alternatively, use the provided setup script:
```bash
chmod +x scripts/setup-d1-database.sh
./scripts/setup-d1-database.sh
```

## API Endpoints

All endpoints remain the same, but now use D1 for storage:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `GET /api/food/menu` - Get food menu
- `POST /api/food/order` - Place an order
- `GET /api/food/orders` - Get user's order history

## Key Benefits of D1 Migration

1. **Relational Data**: D1 supports SQL queries and relationships
2. **Better Performance**: More efficient queries with indexes
3. **Data Integrity**: Foreign keys and constraints
4. **Scalability**: Better for complex queries and larger datasets
5. **Analytics**: SQL allows for complex reporting and analytics