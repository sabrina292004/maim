# EventX Studio Frontend Components

This document provides a comprehensive overview of all the frontend components created for the EventX Studio application.

## 🏗️ Component Architecture

The application follows a modular component architecture with clear separation of concerns:

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin-specific components
│   ├── user/           # User dashboard components
│   ├── navigation/     # Navigation components
│   └── index.js        # Component exports
├── styles/
│   └── globalStyles.js # Global CSS-in-JS styles
└── App.jsx             # Main application with routing
```

## 🔐 Authentication Components

### LoginForm

**Location**: `src/components/auth/LoginForm.jsx`

A comprehensive login form with modern UI design and validation.

**Features**:

- Email and password authentication
- Social login options (Google, Facebook)
- Form validation and error handling
- Responsive design with Material-UI
- Password visibility toggle
- Loading states

**Usage**:

```jsx
import { LoginForm } from "./components/auth";

// In your route
<Route path="/login" element={<LoginForm />} />;
```

### RegisterForm

**Location**: `src/components/auth/RegisterForm.jsx`

A detailed registration form with user profile information collection.

**Features**:

- Comprehensive user information collection
- Password confirmation validation
- Interest selection with chips
- Personal information fields (age, gender, location)
- Form validation and success feedback
- Responsive grid layout

**Usage**:

```jsx
import { RegisterForm } from "./components/auth";

// In your route
<Route path="/register" element={<RegisterForm />} />;
```

## 🧭 Navigation Components

### MainNavbar

**Location**: `src/components/navigation/MainNavbar.jsx`

The main navigation bar with responsive design and authentication state management.

**Features**:

- Responsive navigation with mobile drawer
- Authentication state-aware rendering
- User profile menu with role-based options
- Search functionality
- Notification badges
- Smooth transitions and animations

**Usage**:

```jsx
import { MainNavbar } from "./components/navigation";

// Automatically included in App.jsx for all routes except auth
```

## 👨‍💼 Admin Components

### AdminLayout

**Location**: `src/components/admin/AdminLayout.jsx`

The main layout wrapper for all admin pages with sidebar navigation.

**Features**:

- Collapsible sidebar with navigation menu
- Responsive design for mobile and desktop
- Quick stats display
- User profile management
- Breadcrumb navigation
- Role-based menu items

**Usage**:

```jsx
import { AdminLayout } from "./components/admin";

// Wraps all admin routes
<Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="events" element={<EventManagement />} />
  {/* ... other admin routes */}
</Route>;
```

### AdminDashboard

**Location**: `src/components/AdminDashboard.jsx`

The main admin dashboard with key metrics and analytics.

**Features**:

- Key performance indicators
- Revenue and sales charts
- Event statistics
- Recent activity feed
- Quick action buttons

### EventManagement

**Location**: `src/components/EventManagement.jsx`

Event management interface with kanban board view.

**Features**:

- Kanban board for event status management
- Event creation and editing
- Search and filtering
- Bulk operations
- Status updates

### AttendeeInsights

**Location**: `src/components/AttendeeInsights.jsx`

Analytics dashboard for attendee demographics and engagement.

**Features**:

- Age distribution charts
- Gender demographics
- Interest analysis
- Location mapping
- Engagement metrics

## 👤 User Components

### UserDashboard

**Location**: `src/components/user/UserDashboard.jsx`

The main user dashboard for event discovery and ticket management.

**Features**:

- Event browsing with search and filters
- Ticket management
- User profile information
- Quick stats and upcoming events
- Responsive tabbed interface

**Usage**:

```jsx
import { UserDashboard } from "./components/user";

// Protected user route
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <UserDashboard />
    </PrivateRoute>
  }
/>;
```

## 🎨 Styling and Theme

### Global Styles

**Location**: `src/styles/globalStyles.js`

Comprehensive CSS-in-JS styling with utility classes and design system.

**Features**:

- CSS reset and base styles
- Utility classes for spacing, colors, and layout
- Responsive design utilities
- Animation classes
- Custom scrollbar styling
- Print styles

**Usage**:

```jsx
import GlobalStyles from "./styles/globalStyles";

// Include in your app
<GlobalStyles />;
```

### Material-UI Theme

**Location**: `src/App.jsx`

Custom Material-UI theme configuration with EventX Studio branding.

**Features**:

- Custom color palette
- Typography system
- Component overrides
- Consistent spacing and borders
- Brand-specific styling

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd Frontend/eventx-frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📱 Responsive Design

All components are built with responsive design principles:

- **Mobile First**: Components start with mobile layouts
- **Breakpoints**: Uses Material-UI breakpoints for consistency
- **Touch Friendly**: Optimized for touch interactions
- **Progressive Enhancement**: Enhanced features for larger screens

## 🎯 Key Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes
- Session management

### User Experience

- Modern, intuitive interface
- Smooth animations and transitions
- Loading states and error handling
- Responsive design across devices

### Admin Capabilities

- Comprehensive dashboard
- Event management
- User management
- Analytics and reporting
- Ticket management

### User Capabilities

- Event discovery and booking
- Ticket management
- Profile customization
- Interest-based recommendations

## 🔧 Customization

### Theme Colors

The application uses a consistent color scheme defined in the theme:

```jsx
palette: {
  primary: {
    main: '#667eea',    // Primary blue
    light: '#8fa4ef',   // Light blue
    dark: '#4c63d2',    // Dark blue
  },
  secondary: {
    main: '#764ba2',    // Secondary purple
    light: '#9a7bb8',   // Light purple
    dark: '#5a3d7a',    // Dark purple
  }
}
```

### Component Styling

Components use Material-UI's `sx` prop for custom styling:

```jsx
<Box
  sx={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 3,
    padding: 4,
    // ... other styles
  }}
>
```

## 📚 Component Usage Examples

### Creating a New Page

```jsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const NewPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          New Page Title
        </Typography>
        <Typography variant="body1">Page content goes here...</Typography>
      </Paper>
    </Box>
  );
};

export default NewPage;
```

### Using the Navigation

```jsx
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/dashboard");
  };

  return <Button onClick={handleNavigation}>Go to Dashboard</Button>;
};
```

## 🧪 Testing

### Component Testing

Each component can be tested independently:

```jsx
import { render, screen } from "@testing-library/react";
import LoginForm from "./components/auth/LoginForm";

test("renders login form", () => {
  render(<LoginForm />);
  expect(screen.getByText("Welcome Back")).toBeInTheDocument();
});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

The application is configured for easy deployment to modern hosting platforms.

## 📖 Additional Resources

- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Styled Components Documentation](https://styled-components.com/)

## 🤝 Contributing

When adding new components:

1. Follow the existing component structure
2. Use the established design system
3. Include proper TypeScript types (if applicable)
4. Add comprehensive documentation
5. Ensure responsive design
6. Follow accessibility guidelines

## 📄 License

This project is part of the EventX Studio application. See the main project README for license information.
