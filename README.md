# Simple Application with Login, Register, Dashboard, and Profile

This is a React application that demonstrates basic user authentication features including login, registration, dashboard, and profile management.

## Features

- **Login**: Secure user login functionality
- **Register**: User registration with form validation
- **Dashboard**: User dashboard with activity overview
- **Profile**: User profile page with view and edit capabilities
- **Navigation**: Intuitive navigation between pages
- **Authentication Context**: Manages user authentication state
- **Responsive Design**: Uses Bootstrap for responsive UI

## Installation

1. Make sure you have Node.js installed on your system
2. Clone or download this repository
3. Navigate to the project directory: `cd /workspaces/tessst`
4. Install dependencies: `npm install`
5. Start the development server: `npm start`

## Usage

1. The application will start on `http://localhost:3000`
2. Register a new account using the registration form
3. Login using your credentials
4. Access the dashboard to see your profile information
5. Visit the profile page to view and edit your profile details

## Project Structure

```
src/
├── components/
│   ├── Navbar.js
│   └── Navbar.css
├── context/
│   └── AuthContext.js
├── pages/
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── DashboardPage.js
│   ├── ProfilePage.js
│   └── CSS files for each page
├── styles/
│   └── App.css
├── App.js
├── index.js
└── index.css
```

## Technologies Used

- React 18
- React Router DOM for navigation
- React Context API for state management
- Bootstrap 5 for styling
- React Scripts for development/build tools

## Authentication Flow

The application simulates authentication by:
1. Storing user data in localStorage
2. Managing authentication state with React Context
3. Protecting routes based on authentication status
4. Providing login, register, and logout functionality