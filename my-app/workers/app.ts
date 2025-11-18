import { Hono } from "hono";
import { createRequestHandler } from "react-router";

interface Env {
	USER_SESSIONS: KVNamespace;
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

    // In a real app, you'd hash the password with bcrypt or similar
    // For this demo, we'll store plain text (don't do this in production!)
    const user = {
      id: Date.now().toString(), // Simple ID generation for demo
      email,
      password, // Should be hashed in production
      firstName,
      lastName,
      createdAt: new Date().toISOString()
    };

    // In a real app, you'd save to a database like D1 or use KV
    // For this demo, we'll just return the user
    // In production, save to D1, KV, or another persistent storage

    // Check if user already exists in KV
    const existingUserKey = `user:${email}`;
    const existingUser = await c.env.USER_SESSIONS.get(existingUserKey);

    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }

    // Store user in KV
    await c.env.USER_SESSIONS.put(existingUserKey, JSON.stringify(user));
    await c.env.USER_SESSIONS.put(`user_id:${user.id}`, email); // Index by ID

    // For demo purposes, return success
    console.log(`New user registered: ${email}`);

    return c.json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
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

    // Get user from KV
    const userKey = `user:${email}`;
    const userStr = await c.env.USER_SESSIONS.get(userKey);

    if (!userStr) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const user = JSON.parse(userStr);

    // In a real app, you'd compare hashed passwords here
    // For demo, we'll just check if the password matches exactly
    if (user.password !== password) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Generate a session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store session in KV with expiration (24 hours)
    await c.env.USER_SESSIONS.put(`session:${sessionToken}`, user.id, { expirationTtl: 86400 });

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
      // Delete the session from KV
      await c.env.USER_SESSIONS.delete(`session:${sessionToken}`);
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

    // Get user ID from session
    const userId = await c.env.USER_SESSIONS.get(`session:${sessionToken}`);

    if (!userId) {
      return c.json({ error: "Session not found or expired" }, 401);
    }

    // Get user email by ID
    const userEmail = await c.env.USER_SESSIONS.get(`user_id:${userId}`);
    if (!userEmail) {
      return c.json({ error: "User not found" }, 401);
    }

    // Get full user details
    const userStr = await c.env.USER_SESSIONS.get(`user:${userEmail}`);
    if (!userStr) {
      return c.json({ error: "User not found" }, 401);
    }

    const user = JSON.parse(userStr);

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;

    return c.json({ user: userWithoutPassword });
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

    // Get user ID from session
    const userId = await c.env.USER_SESSIONS.get(`session:${sessionToken}`);

    if (!userId) {
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
    const orderId = `order_${Date.now()}_${userId}`;

    // Calculate total
    const calculatedTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Validate total
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return c.json({ error: "Invalid total amount" }, 400);
    }

    // Create order object
    const order = {
      id: orderId,
      userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store order in KV
    await c.env.USER_SESSIONS.put(`order:${orderId}`, JSON.stringify(order));

    // Store user's order history
    const userOrdersKey = `user_orders:${userId}`;
    let userOrdersStr = await c.env.USER_SESSIONS.get(userOrdersKey);
    let userOrders: string[] = userOrdersStr ? JSON.parse(userOrdersStr) : [];
    userOrders.push(orderId);
    await c.env.USER_SESSIONS.put(userOrdersKey, JSON.stringify(userOrders));

    return c.json({
      message: "Order placed successfully",
      order: { id: orderId, status: order.status }
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

    // Get user ID from session
    const userId = await c.env.USER_SESSIONS.get(`session:${sessionToken}`);

    if (!userId) {
      return c.json({ error: "Session not found or expired" }, 401);
    }

    // Get user's order history
    const userOrdersKey = `user_orders:${userId}`;
    const userOrdersStr = await c.env.USER_SESSIONS.get(userOrdersKey);
    const orderIds = userOrdersStr ? JSON.parse(userOrdersStr) : [];

    // Fetch each order
    const orders = [];
    for (const orderId of orderIds) {
      const orderStr = await c.env.USER_SESSIONS.get(`order:${orderId}`);
      if (orderStr) {
        orders.push(JSON.parse(orderStr));
      }
    }

    return c.json({ orders });
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
