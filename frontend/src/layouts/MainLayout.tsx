import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Box } from '@mui/material';

const MainLayout = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}
    >
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout; 