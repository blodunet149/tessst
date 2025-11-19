# API Testing Guide

This guide provides instructions on how to test the API endpoints for the application using D1 database.

## Prerequisites

- Your D1 database must be set up and configured
- The application must be deployed or running locally

## Testing Endpoints

### 1. Registration

To register a new user, send a POST request to `/api/auth/register`:

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

### 2. Login

To log in, send a POST request to `/api/auth/login`:

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

The response will also include a session cookie that's used for authentication in subsequent requests.

### 3. Get Current User

To get the current user info, send a GET request to `/api/auth/me`:

```bash
curl -X GET http://localhost:8787/api/auth/me \
  -H "Cookie: session_token=your_session_token_here"
```

Expected response:
```json
{
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 4. Logout

To log out, send a POST request to `/api/auth/logout`:

```bash
curl -X POST http://localhost:8787/api/auth/logout \
  -H "Cookie: session_token=your_session_token_here"
```

Expected response:
```json
{
  "message": "Logout successful"
}
```

### 5. Get Menu

To get the food menu, send a GET request to `/api/food/menu`:

```bash
curl -X GET http://localhost:8787/api/food/menu
```

Expected response:
```json
{
  "menu": [
    {
      "id": "1",
      "name": "Nasi Goreng",
      "description": "Nasi goreng spesial dengan telur dan kerupuk",
      "price": 35000,
      "category": "Makanan",
      "image": "/images/nasi-goreng.jpg",
      "available": true
    },
    // ... more menu items
  ]
}
```

### 6. Place an Order

To place an order, send a POST request to `/api/food/order`:

```bash
curl -X POST http://localhost:8787/api/food/order \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=your_session_token_here" \
  -d '{
    "items": [
      {
        "id": "1",
        "name": "Nasi Goreng",
        "price": 35000,
        "quantity": 2
      }
    ],
    "totalAmount": 70000,
    "deliveryAddress": "123 Test Street",
    "paymentMethod": "credit_card"
  }'
```

Expected response:
```json
{
  "message": "Order placed successfully",
  "order": {
    "id": "order_id",
    "status": "pending"
  }
}
```

### 7. Get Order History

To get a user's order history, send a GET request to `/api/food/orders`:

```bash
curl -X GET http://localhost:8787/api/food/orders \
  -H "Cookie: session_token=your_session_token_here"
```

Expected response:
```json
{
  "orders": [
    {
      "id": "order_id",
      "items": [
        {
          "id": "1",
          "name": "Nasi Goreng",
          "price": 35000,
          "quantity": 2
        }
      ],
      "totalAmount": 70000,
      "deliveryAddress": "123 Test Street",
      "paymentMethod": "credit_card",
      "status": "pending",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

## Database Verification

You can verify the data is correctly stored in your D1 database using wrangler:

```bash
# Check users table
wrangler d1 execute my-app-db --command="SELECT * FROM users;"

# Check sessions table
wrangler d1 execute my-app-db --command="SELECT * FROM sessions;"

# Check orders table
wrangler d1 execute my-app-db --command="SELECT * FROM orders;"
```

## Troubleshooting

If you encounter issues with authentication:

1. Make sure your session has not expired (default 24 hours)
2. Verify the session token is being sent as a cookie in requests
3. Check that the database is properly configured and migrated
4. Ensure all required fields are included in requests