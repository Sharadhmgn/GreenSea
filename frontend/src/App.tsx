import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, alpha } from '@mui/material';
import NewHeader from './components/NewHeader';
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
import GlobalStyles from './components/GlobalStyles';
import PerformanceSwitch from './components/PerformanceSwitch';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

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
      main: '#356648', // Rich forest green
      light: '#4a7a5a',
      dark: '#265037',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1a5f7a', // Deep ocean blue
      light: '#2389b5',
      dark: '#0d4d66',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#fff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff8a00', // Warm orange
      light: '#ffbb4d',
      dark: '#c25e00',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    background: {
      default: '#fcfcfa', // Soft cream background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333', // Darker text for better readability
      secondary: '#666666', // Medium gray for secondary text
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      letterSpacing: '-0.02em',
      color: '#333333',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.75rem',
      letterSpacing: '-0.01em',
      color: '#333333',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      color: '#333333',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#333333',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#333333',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#333333',
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
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25, // Rounded buttons like Four Sigmatic
          padding: '10px 24px',
          boxShadow: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(45deg, #356648 30%, #4a7a5a 90%)',
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
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          border: 'none',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.05)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(53, 102, 72, 0.1)', // Subtle green border
          color: '#333333',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(53, 102, 72, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(53, 102, 72, 0.1)',
            },
            '&.Mui-selected': {
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          transition: 'color 0.2s ease-in-out',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
          '@media (min-width: 600px)': {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Main App component
const App = () => {
  const [reduceAnimations, setReduceAnimations] = useState(() => {
    // Get saved preference from localStorage
    const saved = localStorage.getItem('performanceMode');
    return saved ? JSON.parse(saved) : false;
  });

  const handlePerformanceModeChange = (isPerformanceMode: boolean) => {
    setReduceAnimations(isPerformanceMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles enableCustomCursor={false} reduceAnimations={reduceAnimations} />
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
                    <NewHeader />
                    <Box 
                      component="main" 
                      sx={{ 
                        flexGrow: 1, 
                        pt: { xs: 0, md: 0 }, 
                        pb: { xs: 0, md: 0 },
                        position: 'relative'
                      }}
                    >
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
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
            <PerformanceSwitch onChange={handlePerformanceModeChange} />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 