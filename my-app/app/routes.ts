import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/menu", "routes/menu.tsx"),
  route("/cart", "routes/cart.tsx"),
  route("/checkout", "routes/checkout.tsx"),
  route("/orders", "routes/orders.tsx"),
] satisfies RouteConfig;
