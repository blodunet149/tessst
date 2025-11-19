-- Test SQL queries for the migrated D1 database
-- These queries demonstrate the functionality that replaces KV operations

-- 1. User registration test
INSERT INTO users (id, email, password, firstName, lastName, createdAt) 
VALUES ('test123', 'test@example.com', 'password123', 'Test', 'User', '2025-01-01T00:00:00Z');

-- 2. User login - create session
INSERT INTO sessions (id, user_id, expires_at) 
VALUES ('session_123456789', 'test123', '2025-01-02T00:00:00Z');

-- 3. Place an order
INSERT INTO orders (id, user_id, items, total_amount, delivery_address, payment_method, status) 
VALUES ('order_987654321', 'test123', '[{"id":"1","name":"Nasi Goreng","price":35000,"quantity":2}]', 70000, '123 Test Street', 'credit_card', 'pending');

-- 4. Get user by email (for login verification)
SELECT id, email, password, firstName, lastName, createdAt FROM users WHERE email = 'test@example.com';

-- 5. Get user session (for authentication)
SELECT user_id FROM sessions WHERE id = 'session_123456789' AND expires_at > '2025-01-01T00:00:00Z';

-- 6. Get user orders
SELECT id, items, total_amount as totalAmount, delivery_address as deliveryAddress, payment_method as paymentMethod, status, created_at as createdAt 
FROM orders WHERE user_id = 'test123' ORDER BY created_at DESC;

-- 7. Delete session (on logout)
DELETE FROM sessions WHERE id = 'session_123456789';