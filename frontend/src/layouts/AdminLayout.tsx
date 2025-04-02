import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useTheme } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * AdminLayout component provides a layout specifically for admin pages
 * with a different styling than the regular user pages
 */
const AdminLayout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header with admin navigation */}
      <Header />
      
      {/* Main content with admin styling */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          pt: 2,
          pb: 6,
          backgroundColor: theme.palette.background.default
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
      
      {/* Admin Footer */}
      <Box 
        component="footer"
        sx={{ 
          py: 2, 
          px: 2, 
          mt: 'auto',
          backgroundColor: theme.palette.background.paper,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
          color: theme.palette.text.secondary,
          fontSize: '0.875rem'
        }}
      >
        Green Sea Foods Admin Panel © {new Date().getFullYear()}
      </Box>
    </Box>
  );
};

export default AdminLayout; 