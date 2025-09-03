// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import MainNavbar from './components/navigation/MainNavbar';
import AdminLayout from './components/admin/AdminLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import UserDashboard from './components/user/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import EventManagement from './components/EventManagement';
import AttendeeInsights from './components/AttendeeInsights';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { Toaster } from 'react-hot-toast';

// Create modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1',
      light: '#8B8EF6',
      dark: '#4F46E5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#A855F7',
      light: '#C084FC',
      dark: '#9333EA',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: -0.5 },
    h2: { fontWeight: 700, letterSpacing: -0.25 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 2px 8px rgba(0,0,0,0.14)',
    '0 6px 20px rgba(0,0,0,0.16)',
    ...Array(22).fill('0 8px 28px rgba(0,0,0,0.18)')
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
          minHeight: '100vh',
        },
        '*': { scrollBehavior: 'smooth' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'none',
          border: '1px solid rgba(15,23,42,0.06)',
          boxShadow: '0 6px 22px rgba(15,23,42,0.06)',
        },
      },
    },
    MuiButton: {
      defaultProps: { size: 'medium' },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 20,
        },
        containedPrimary: {
          background:
            'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255,255,255,0.06)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      <Toaster position="top-right" />
      {!hideNavbar && <MainNavbar />}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="/events" element={<div>Events Page</div>} />
        <Route path="/event/:id" element={<div>Event Details Page</div>} />
        <Route path="/tickets" element={<div>My Tickets Page</div>} />
        <Route path="/ticket/:id" element={<div>Ticket Details Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="analytics" element={<AttendeeInsights />} />
          <Route path="users" element={<div>User Management Page</div>} />
          <Route path="tickets" element={<div>Ticket Management Page</div>} />
          <Route path="categories" element={<div>Categories Page</div>} />
          <Route path="payments" element={<div>Payments Page</div>} />
          <Route path="support" element={<div>Support Page</div>} />
          <Route path="marketing" element={<div>Marketing Page</div>} />
          <Route path="settings" element={<div>Admin Settings Page</div>} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
