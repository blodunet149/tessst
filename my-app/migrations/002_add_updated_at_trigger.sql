-- Add index on order status for better query performance
CREATE INDEX idx_orders_status ON orders(status);