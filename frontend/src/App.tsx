import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import AboutUsPage from './pages/AboutUsPage';
import BestSellersPage from './pages/BestSellersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import ProductForm from './pages/admin/ProductForm';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component (protected + admin role check)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Check what's in localStorage directly
  const localStorageUser = localStorage.getItem('user');
  const parsedUser = localStorageUser ? JSON.parse(localStorageUser) : null;
  
  console.log('AdminRoute check - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute check - user from context:', user);
  console.log('AdminRoute check - isAdmin value from context:', user?.isAdmin);
  console.log('AdminRoute check - localStorage user:', parsedUser);
  console.log('AdminRoute check - localStorage isAdmin:', parsedUser?.isAdmin);
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    console.log('AdminRoute redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin role - prioritize localStorage for debugging
  const isAdmin = parsedUser?.isAdmin || user?.isAdmin;
  
  if (!isAdmin) {
    // Redirect to home if not admin
    console.log('AdminRoute redirecting to home - not admin');
    return <Navigate to="/" replace />;
  }
  
  console.log('AdminRoute granting access - is admin');
  return <>{children}</>;
};

// Create a custom theme for the application
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32', // Green as primary color (from "Green" in logo)
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1a5f7a', // Ocean blue (from fish in logo) as secondary
      light: '#4a8ca6',
      dark: '#003c52',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50', // Lighter green for success states
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#fff',
    },
    info: {
      main: '#0288d1', // Blue for information
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff8a00', // Orange for warnings/promotions
      light: '#ffbb4d',
      dark: '#c25e00',
      contrastText: '#fff',
    },
    background: {
      default: '#f8fff9', // Very slight green tint to background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1e3a29', // Darker green-tinted text
      secondary: '#546e7a', // Blue-gray secondary text
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
      color: '#2e7d32', // Green headings
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
      color: '#2e7d32', // Green headings
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#2e7d32', // Green headings
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(45deg, #2e7d32 30%, #43a047 90%)',
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            background: 'linear-gradient(45deg, #1a5f7a 30%, #2389b5 90%)',
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
          },
          borderLeft: '4px solid #2e7d32', // Green accent border
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderBottom: '1px solid rgba(46, 125, 50, 0.1)', // Subtle green border
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRight: '1px solid rgba(46, 125, 50, 0.1)', // Subtle green border
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          borderTop: '3px solid #2e7d32', // Green accent
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.08)', // Light green hover
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: 8,
          padding: '0 6px',
          minWidth: 20,
          height: 20,
          fontSize: '0.75rem',
          fontWeight: 600,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          border: '2px solid #2e7d32', // Green border for avatars
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(46, 125, 50, 0.1)', // Light green dividers
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.08)', // Light green hover
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2e7d32', // Green focused border
            borderWidth: 2,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#2e7d32', // Green links
          '&:hover': {
            color: '#1b5e20',
          },
        },
      },
    },
  },
});

// Main App component
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Admin Routes - using AdminLayout */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductsManagement />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="orders" element={<OrdersManagement />} />
              </Route>

              {/* Regular Routes */}
              <Route 
                element={
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <Box component="main" sx={{ flexGrow: 1, pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 } }}>
                      <Outlet />
                    </Box>
                    <Footer />
                  </Box>
                }
              >
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/best-sellers" element={<BestSellersPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                
                {/* Protected user routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <div>Profile Page (Coming Soon)</div>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <div>Orders Page (Coming Soon)</div>
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 route */}
                <Route path="*" element={<div>Page Not Found</div>} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 