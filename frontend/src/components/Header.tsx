import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  Fade,
  Typography,
  Collapse,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

// Navigation item interface
interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

const Header = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { cart = [] } = useCart() || { cart: [] };
  const { user, isAuthenticated, logout } = useAuth() || { user: null, isAuthenticated: false, logout: () => {} };
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const cartItemsCount = cart?.reduce((count, item) => count + (item?.quantity || 0), 0) || 0;
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Regular user navigation items
  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Best Sellers', path: '/best-sellers' },
    { name: 'About Us', path: '/about-us' },
  ];
  
  // Admin navigation items
  const adminNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: <DashboardIcon fontSize="small" /> },
    { name: 'Products', path: '/admin/products', icon: <InventoryIcon fontSize="small" /> },
    { name: 'Categories', path: '/admin/categories', icon: <CategoryIcon fontSize="small" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCartIcon fontSize="small" /> },
    { name: 'Users', path: '/admin/users', icon: <PeopleIcon fontSize="small" /> },
  ];
  
  // Choose which navigation items to display
  const displayNavItems = isAdminPage ? adminNavItems : navItems;
  
  // Visible nav items based on screen size
  const visibleNavItems = isTablet ? displayNavItems.slice(0, 3) : displayNavItems;
  
  const drawer = (
    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Logo height={40} />
        </Box>
        <IconButton 
          edge="end" 
          color="inherit" 
          aria-label="close" 
          onClick={handleDrawerToggle}
          sx={{ 
            bgcolor: 'rgba(53, 102, 72, 0.08)',
            '&:hover': { bgcolor: 'rgba(53, 102, 72, 0.15)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flex: 1, p: 0 }}>
        {isAdminPage ? (
          // Admin navigation in drawer
          adminNavItems.map((item) => (
            <ListItem
              key={item.name}
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                py: 2,
                px: 3,
                textDecoration: 'none',
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                bgcolor: isActive(item.path) ? 'rgba(53, 102, 72, 0.08)' : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(53, 102, 72, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: isActive(item.path) ? 600 : 400,
                    letterSpacing: '0.5px',
                  }
                }}
              />
            </ListItem>
          ))
        ) : (
          // Regular navigation in drawer
          navItems.map((item) => (
            <ListItem
              key={item.name}
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                py: 2,
                px: 3,
                textDecoration: 'none',
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                bgcolor: isActive(item.path) ? 'rgba(53, 102, 72, 0.08)' : 'transparent',
                transition: 'all 0.3s ease',
                borderLeft: isActive(item.path) ? '4px solid' : '4px solid transparent',
                borderLeftColor: isActive(item.path) ? 'primary.main' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(53, 102, 72, 0.05)',
                },
              }}
            >
              <ListItemText 
                primary={item.name}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: isActive(item.path) ? 600 : 500,
                    letterSpacing: '0.5px',
                  }
                }}
              />
            </ListItem>
          ))
        )}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ p: 3 }}>
        {!isAuthenticated ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              component={RouterLink} 
              to="/login" 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleDrawerToggle}
              sx={{ borderRadius: 50 }}
            >
              Sign In
            </Button>
            <Button 
              component={RouterLink} 
              to="/register" 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={handleDrawerToggle}
              sx={{ borderRadius: 50 }}
            >
              Create Account
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!isAdminPage && (
              <>
                <Button
                  component={RouterLink}
                  to="/profile"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleDrawerToggle}
                  sx={{ borderRadius: 50 }}
                >
                  My Account
                </Button>
                
                <Button
                  component={RouterLink}
                  to="/orders"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleDrawerToggle}
                  sx={{ borderRadius: 50 }}
                >
                  My Orders
                </Button>
              </>
            )}
            
            <Button 
              onClick={() => {
                handleDrawerToggle();
                logout();
              }} 
              variant="contained" 
              color="primary"
              fullWidth
              sx={{ borderRadius: 50 }}
            >
              Sign Out
            </Button>
            
            {user?.isAdmin && !isAdminPage && (
              <Button
                component={RouterLink}
                to="/admin"
                variant="outlined"
                color="secondary"
                startIcon={<DashboardIcon />}
                fullWidth
                onClick={handleDrawerToggle}
                sx={{ mt: 2, borderRadius: 50 }}
              >
                Admin Dashboard
              </Button>
            )}
            
            {isAdminPage && (
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleDrawerToggle}
                sx={{ mt: 2, borderRadius: 50 }}
              >
                Back to Store
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
  
  return (
    <AppBar 
      position="sticky" 
      elevation={scrolled ? 2 : 0}
      sx={{ 
        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        color: 'text.primary',
        borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            py: { xs: 1, sm: 1.5 },
          }}
        >
          {/* Mobile menu toggle */}
          {!isAdminPage && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                bgcolor: 'rgba(53, 102, 72, 0.08)',
                '&:hover': { bgcolor: 'rgba(53, 102, 72, 0.15)' }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Logo */}
          <Box 
            component={RouterLink} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 4 }
            }}
          >
            <Logo variant={isMobile ? 'compact' : 'full'} height={isMobile ? 40 : 45} />
          </Box>
          
          {/* Desktop navigation links */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              justifyContent: isAdminPage ? 'flex-start' : 'center',
              ml: isAdminPage ? 2 : 0,
            }}
          >
            {displayNavItems.map((item) => (
              <Button
                key={item.name}
                component={RouterLink}
                to={item.path}
                startIcon={isAdminPage ? item.icon : null}
                sx={{
                  position: 'relative',
                  mx: { md: 0.5, lg: 1 },
                  py: 1,
                  px: { md: 1.5, lg: 2 },
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  fontWeight: isActive(item.path) ? 600 : 500,
                  '&:hover': {
                    bgcolor: 'rgba(53, 102, 72, 0.05)',
                  },
                  '&::after': isActive(item.path) ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40%',
                    height: '3px',
                    bgcolor: 'primary.main',
                    borderRadius: '2px',
                  } : {},
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          
          {/* User and cart actions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            ml: 'auto',
          }}>
            {/* If not admin page, show cart button */}
            {!isAdminPage && (
              <IconButton 
                color="inherit" 
                component={RouterLink} 
                to="/cart"
                sx={{
                  ml: { xs: 1, sm: 2 },
                  bgcolor: isActive('/cart') ? 'rgba(53, 102, 72, 0.08)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(53, 102, 72, 0.08)' },
                }}
              >
                <Badge badgeContent={cartItemsCount} color="primary" overlap="circular">
                  <CartIcon />
                </Badge>
              </IconButton>
            )}
            
            {/* Search button */}
            <IconButton 
              color="inherit"
              sx={{
                ml: { xs: 1, sm: 2 },
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(53, 102, 72, 0.08)' },
              }}
            >
              <SearchIcon />
            </IconButton>
            
            {/* If logged in, show user menu button */}
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  sx={{
                    ml: { xs: 1, sm: 2 },
                    bgcolor: Boolean(anchorEl) ? 'rgba(53, 102, 72, 0.08)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(53, 102, 72, 0.08)' },
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      bgcolor: 'primary.main',
                      color: 'white',
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                  sx={{
                    '& .MuiPaper-root': { 
                      borderRadius: 3,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                      mt: 1.5,
                      border: '1px solid rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user?.name || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || 'user@example.com'}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  
                  {!isAdminPage && (
                    <div>
                      <MenuItem onClick={() => handleSettingClick('/profile')} dense>
                        My Account
                      </MenuItem>
                      <MenuItem onClick={() => handleSettingClick('/orders')} dense>
                        My Orders
                      </MenuItem>
                    </div>
                  )}
                  
                  {user?.isAdmin && !isAdminPage && (
                    <div>
                      <Divider sx={{ my: 1 }} />
                      <MenuItem onClick={() => handleSettingClick('/admin')} dense>
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Admin Dashboard
                      </MenuItem>
                    </div>
                  )}
                  
                  {isAdminPage && (
                    <MenuItem onClick={() => handleSettingClick('/')} dense>
                      Back to Store
                    </MenuItem>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} dense>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Show sign in / register buttons for logged out users
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 2 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    mr: 2,
                    borderRadius: 50,
                    px: 2,
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ 
                    borderRadius: 50,
                    px: 2,
                  }}
                >
                  Sign In
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: { xs: '85%', sm: 360 },
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header; 