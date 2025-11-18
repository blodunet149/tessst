import { Link } from "react-router";
import { useAuth } from '../components/auth/auth-context';

export function loader() {
  return null;
}

export default function DashboardHome() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Welcome to Your Dashboard
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {isAuthenticated 
                ? `Hello, ${user?.firstName}! Manage your account and track your activities.` 
                : 'Please log in to access your dashboard'}
            </p>
          </div>

          <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
            {isAuthenticated ? (
              <>
                <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600">
                        Account
                      </p>
                      <Link to="/profile" className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">
                          Profile Settings
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          Update your personal information and account settings.
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600">
                        Analytics
                      </p>
                      <div className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">
                          Dashboard Analytics
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          View your activity statistics and performance metrics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600">
                        Settings
                      </p>
                      <div className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">
                          Application Settings
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          Customize your dashboard experience and preferences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden col-span-3">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                      Authentication Required
                    </p>
                    <div className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">
                        Please sign in to continue
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        Log in to access your dashboard and all available features.
                      </p>
                      <div className="mt-6">
                        <Link
                          to="/login"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Create Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}