import { Hono } from "hono";
import { createRequestHandler } from "react-router";

interface Env {
	DB: D1Database;
	// Add other environment bindings as needed
}

const app = new Hono<{ Bindings: Env }>();

// Authentication endpoints
app.post("/api/auth/register", async (c) => {
  try {
    const { email, password, firstName, lastName } = await c.req.json();

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Check if user already exists in database
    const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }

    // In a real app, you'd hash the password with bcrypt or similar
    // For this demo, we'll store plain text (don't do this in production!)
    const userId = Date.now().toString(); // Simple ID generation for demo

    // Insert new user into database
    await c.env.DB.prepare(
      'INSERT INTO users (id, email, password, firstName, lastName, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, email, password, firstName, lastName, new Date().toISOString()).run();

    // For demo purposes, return success
    console.log(`New user registered: ${email}`);

    return c.json({
      message: "User registered successfully",
      user: { id: userId, email: email, firstName: firstName, lastName: lastName }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Registration failed" }, 500);
  }
});

app.post("/api/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Get user from database
    const user = await c.env.DB.prepare(
      'SELECT id, email, password, firstName, lastName, createdAt FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // In a real app, you'd compare hashed passwords here
    // For demo, we'll just check if the password matches exactly
    if (user.password !== password) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Generate a session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate expiration time (24 hours from now)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    // Store session in database
    await c.env.DB.prepare(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).bind(sessionToken, user.id, expiresAt.toISOString()).run();

    // Set a cookie with the session token
    c.header("Set-Cookie", `session_token=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`); // 24 hours

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;

    return c.json({
      message: "Login successful",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

app.post("/api/auth/logout", async (c) => {
  try {
    // Get the session token from cookies
    const cookieHeader = c.req.header("Cookie");
    const sessionToken = cookieHeader?.match(/session_token=([^;]+)/)?.[1];

    if (sessionToken) {
      // Delete the session from database
      await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionToken).run();
    }

    // Clear the session cookie
    c.header("Set-Cookie", "session_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict");

    return c.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ error: "Logout failed" }, 500);
  }
});

// Get current user info
app.get("/api/auth/me", async (c) => {
  try {
    // Get the session token from cookies
    const cookieHeader = c.req.header("Cookie");
    const sessionToken = cookieHeader?.match(/session_token=([^;]+)/)?.[1];

    if (!sessionToken) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    // Verify session in database
    const session = await c.env.DB.prepare(
      'SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?'
    ).bind(sessionToken, new Date().toISOString()).first();

    if (!session) {
      return c.json({ error: "Session not found or expired" }, 401);
    }

    // Get user details from database
    const user = await c.env.DB.prepare(
      'SELECT id, email, firstName, lastName, createdAt FROM users WHERE id = ?'
    ).bind(session.user_id).first();

    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    return c.json({ user: user });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Failed to get user info" }, 500);
  }
});

// Food ordering endpoints
interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

// Get food menu
app.get("/api/food/menu", async (c) => {
  try {
    // For demo, return static food menu
    // In production, you'd fetch from KV or D1
    const menu: FoodItem[] = [
      {
        id: "1",
        name: "Nasi Goreng",
        description: "Nasi goreng spesial dengan telur dan kerupuk",
        price: 35000,
        category: "Makanan",
        image: "/images/nasi-goreng.jpg",
        available: true
      },
      {
        id: "2",
        name: "Mie Ayam",
        description: "Mie ayam dengan pangsit dan jamur",
        price: 28000,
        category: "Makanan",
        image: "/images/mie-ayam.jpg",
        available: true
      },
      {
        id: "3",
        name: "Bakso",
        description: "Bakso sapi dengan kuah gurih",
        price: 25000,
        category: "Makanan",
        image: "/images/bakso.jpg",
        available: true
      },
      {
        id: "4",
        name: "Es Teh",
        description: "Es teh manis segar",
        price: 5000,
        category: "Minuman",
        image: "/images/es-teh.jpg",
        available: true
      },
      {
        id: "5",
        name: "Jus Alpukat",
        description: "Jus alpukat dengan susu dan gula aren",
        price: 18000,
        category: "Minuman",
        image: "/images/jus-alpukat.jpg",
        available: true
      }
    ];

    return c.json({ menu });
  } catch (error) {
    console.error("Get menu error:", error);
    return c.json({ error: "Failed to get menu" }, 500);
  }
});

// Place an order
app.post("/api/food/order", async (c) => {
  try {
    // Get the session token from cookies
    const cookieHeader = c.req.header("Cookie");
    const sessionToken = cookieHeader?.match(/session_token=([^;]+)/)?.[1];

    if (!sessionToken) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    // Verify session in database
    const session = await c.env.DB.prepare(
      'SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?'
    ).bind(sessionToken, new Date().toISOString()).first();

    if (!session) {
      return c.json({ error: "Session not found or expired" }, 401);
    }

    const { items, totalAmount, deliveryAddress, paymentMethod } = await c.req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Items are required" }, 400);
    }

    if (!deliveryAddress || !paymentMethod) {
      return c.json({ error: "Delivery address and payment method are required" }, 400);
    }

    // Generate order ID
    const orderId = `order_${Date.now()}_${session.user_id}`;

    // Calculate total
    const calculatedTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Validate total
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return c.json({ error: "Invalid total amount" }, 400);
    }

    // Store order in database (items as JSON string)
    await c.env.DB.prepare(
      'INSERT INTO orders (id, user_id, items, total_amount, delivery_address, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      orderId,
      session.user_id,
      JSON.stringify(items),
      totalAmount,
      deliveryAddress,
      paymentMethod,
      'pending'
    ).run();

    return c.json({
      message: "Order placed successfully",
      order: { id: orderId, status: 'pending' }
    });
  } catch (error) {
    console.error("Place order error:", error);
    return c.json({ error: "Failed to place order" }, 500);
  }
});

// Get user's order history
app.get("/api/food/orders", async (c) => {
  try {
    // Get the session token from cookies
    const cookieHeader = c.req.header("Cookie");
    const sessionToken = cookieHeader?.match(/session_token=([^;]+)/)?.[1];

    if (!sessionToken) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    // Verify session in database
    const session = await c.env.DB.prepare(
      'SELECT user_id FROM sessions WHERE id = ? AND expires_at > ?'
    ).bind(sessionToken, new Date().toISOString()).first();

    if (!session) {
      return c.json({ error: "Session not found or expired" }, 401);
    }

    // Get user's order history from database
    const orders = await c.env.DB.prepare(
      'SELECT id, items, total_amount as totalAmount, delivery_address as deliveryAddress, payment_method as paymentMethod, status, created_at as createdAt FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(session.user_id).all();

    // Parse items from JSON strings for each order
    const parsedOrders = orders.results.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    return c.json({ orders: parsedOrders });
  } catch (error) {
    console.error("Get orders error:", error);
    return c.json({ error: "Failed to get orders" }, 500);
  }
});

app.get("*", (c) => {
	const requestHandler = createRequestHandler(
		() => import("virtual:react-router/server-build"),
		import.meta.env.MODE,
	);

	return requestHandler(c.req.raw, {
		cloudflare: { env: c.env, ctx: c.executionCtx },
	});
});

export default app;
