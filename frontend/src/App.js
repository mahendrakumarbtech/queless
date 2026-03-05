import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthContext';
import { PublicSettingsProvider, usePublicSettings } from './context/PublicSettingsContext';
import PrivateRoute from './components/front/PrivateRoute';
import Navbar from './components/front/Navbar';
import SneatLayout from './components/admin/SneatLayout';
import Home from './pages/front/Home';
import Login from './pages/front/Login';
import Register from './pages/front/Register';
import CustomerDashboard from './pages/front/CustomerDashboard';
import ProviderDashboard from './pages/front/ProviderDashboard';
import StaffDashboard from './pages/front/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminProviders from './pages/admin/Providers';
import AdminQueues from './pages/admin/Queues';
import AdminSettings from './pages/admin/Settings';
import Roles from './pages/admin/Roles';
import RoleForm from './pages/admin/RoleForm';
import AdminLogin from './pages/admin/AdminLogin';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import ProviderList from './pages/front/ProviderList';
import BookQueue from './pages/front/BookQueue';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Admin-specific theme with modern gradient colors
const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 12,
  },
});

// Document title and favicon from public settings
const DocumentHead = () => {
  const { websiteName, faviconIcon } = usePublicSettings();
  React.useEffect(() => {
    document.title = websiteName ? `${websiteName}` : document.title;
  }, [websiteName]);
  React.useEffect(() => {
    if (!faviconIcon) return;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconIcon;
  }, [faviconIcon]);
  return null;
};

// Component to conditionally show Navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return !isAdminRoute ? <Navbar /> : null;
};

// Theme Wrapper Component
const ThemeWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const currentTheme = isAdminRoute ? adminTheme : theme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PublicSettingsProvider>
          <Router>
            <ThemeWrapper>
              <DocumentHead />
              <ConditionalNavbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/providers" element={<ProviderList />} />
              <Route
                path="/customer"
                element={
                  <PrivateRoute>
                    <CustomerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/provider"
                element={
                  <PrivateRoute allowedRoles={['provider', 'admin']}>
                    <ProviderDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <PrivateRoute allowedRoles={['staff', 'admin']}>
                    <StaffDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/book/:providerId"
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <BookQueue />
                  </PrivateRoute>
                }
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/forgot_password" element={<AdminForgotPassword />} />
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute allowedRoles={['admin', 'staff']} redirectToAdminLogin>
                    <SneatLayout>
                      <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="roles" element={<Roles />} />
                        <Route path="roles/create" element={<RoleForm />} />
                        <Route path="roles/:id/edit" element={<RoleForm />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="users/:roleFilter" element={<AdminUsers />} />
                        <Route path="providers" element={<AdminProviders />} />
                        <Route path="queues" element={<AdminQueues />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                      </Routes>
                    </SneatLayout>
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ThemeWrapper>
        </Router>
        </PublicSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
