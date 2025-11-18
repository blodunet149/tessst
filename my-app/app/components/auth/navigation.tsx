import { Link, Form } from "react-router";
import { useAuth } from './auth-context';
import { CartWidget } from '../food/cart-component';

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link to="/">Food Dashboard</Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/menu"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Menu
              </Link>
              <CartWidget />
              <span className="text-white">Hello, {user?.firstName}!</span>
              <Link
                to="/orders"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Orders
              </Link>
              <Link
                to="/profile"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <Form method="post" action="/api/auth/logout" onSubmit={(e) => {
                e.preventDefault();
                if (window.confirm('Are you sure you want to logout?')) {
                  logout();
                }
              }}>
                <button
                  type="submit"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <>
              <Link
                to="/menu"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Menu
              </Link>
              <CartWidget />
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}