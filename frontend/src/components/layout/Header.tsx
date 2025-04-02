import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

// Navigation pages
const pages = [
  { title: 'Home', path: '/' },
  { title: 'Shop', path: '/shop' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' }
];

// Settings menu items
const settings = [
  { title: 'Profile', path: '/profile' },
  { title: 'My Orders', path: '/my-orders' },
  { title: 'Logout', path: '/logout' }
];

// Admin menu items
const adminSettings = [
  { title: 'Admin Dashboard', path: '/admin' },
  ...settings
];

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { items } = useCart();
  
  // Get this from auth context in a real app
  const isLoggedIn = false;
  const isAdmin = false;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingClick = (path: string) => {
    handleCloseUserMenu();
    if (path === '/logout') {
      // Handle logout logic here
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            GREEN SEA FOODS
          </Typography>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleMobileMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              justifyContent: 'center',
            }}
          >
            GREEN SEA FOODS
          </Typography>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                sx={{ 
                  my: 2, 
                  mx: 1,
                  color: 'text.primary', 
                  display: 'block',
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Cart icon and User menu */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <IconButton 
              component={RouterLink} 
              to="/cart" 
              size="large" 
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={items.length} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            
            {isLoggedIn ? (
              <Box>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar alt="User Avatar" sx={{ bgcolor: 'primary.main' }}>
                      <AccountCircle />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {(isAdmin ? adminSettings : settings).map((setting) => (
                    <MenuItem key={setting.title} onClick={() => handleSettingClick(setting.path)}>
                      <Typography textAlign="center">{setting.title}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component={RouterLink}
                to="/login"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile menu drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': { 
            width: '70%', 
            maxWidth: '300px',
            boxSizing: 'border-box' 
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" color="primary.main" fontWeight={700}>
            Menu
          </Typography>
          <IconButton onClick={toggleMobileMenu}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {pages.map((page) => (
            <ListItem key={page.title} disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to={page.path}
                onClick={toggleMobileMenu}
              >
                <ListItemText primary={page.title} />
              </ListItemButton>
            </ListItem>
          ))}
          {!isLoggedIn && (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to="/login"
                  onClick={toggleMobileMenu}
                >
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to="/register"
                  onClick={toggleMobileMenu}
                >
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header; 