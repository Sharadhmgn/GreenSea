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
  ];
  
  // Choose which navigation items to display
  const displayNavItems = isAdminPage ? adminNavItems : navItems;
  
  // Visible nav items based on screen size
  const visibleNavItems = isTablet ? displayNavItems.slice(0, 3) : displayNavItems;
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Logo height={40} />
        </Box>
        <IconButton edge="end" color="inherit" aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {isAdminPage ? (
          // Admin navigation in drawer
          adminNavItems.map((item) => (
            <ListItem
              key={item.name}
              component={RouterLink}
              to={item.path}
              sx={{
                textDecoration: 'none',
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                bgcolor: isActive(item.path) ? 'rgba(46, 125, 50, 0.08)' : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(46, 125, 50, 0.08)',
                },
              }}
            >
              <ListItemIcon>
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
              sx={{
                textDecoration: 'none',
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                bgcolor: isActive(item.path) ? 'rgba(46, 125, 50, 0.08)' : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(46, 125, 50, 0.08)',
                },
              }}
            >
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
        )}
        
        <Divider sx={{ my: 1 }} />
        {!isAuthenticated ? (
          <>
            <ListItem component={RouterLink} to="/login" sx={{ textDecoration: 'none', color: 'text.primary' }}>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem component={RouterLink} to="/register" sx={{ textDecoration: 'none', color: 'text.primary' }}>
              <ListItemText primary="Create Account" />
            </ListItem>
          </>
        ) : (
          <>
            {!isAdminPage && (
              <>
                <ListItem component={RouterLink} to="/profile" sx={{ textDecoration: 'none', color: 'text.primary' }}>
                  <ListItemText primary="My Account" />
                </ListItem>
                <ListItem component={RouterLink} to="/orders" sx={{ textDecoration: 'none', color: 'text.primary' }}>
                  <ListItemText primary="My Orders" />
                </ListItem>
              </>
            )}
            
            <ListItem button onClick={logout} sx={{ textDecoration: 'none', color: 'text.primary' }}>
              <ListItemText primary="Sign Out" />
            </ListItem>
            
            {user?.isAdmin && !isAdminPage && (
              <>
                <Divider />
                <ListItem component={RouterLink} to="/admin" sx={{ textDecoration: 'none', color: 'text.primary' }}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </>
            )}
            
            {isAdminPage && (
              <>
                <Divider />
                <ListItem component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'text.primary' }}>
                  <ListItemText primary="Back to Store" />
                </ListItem>
              </>
            )}
          </>
        )}
      </List>
    </Box>
  );
  
  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={scrolled ? 2 : 0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: scrolled ? 'none' : '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          px: { xs: 0 }, 
          py: scrolled ? 0.5 : 1,
          transition: 'all 0.3s ease',
          justifyContent: 'space-between' 
        }}>
          {/* Logo with conditional link */}
          <RouterLink to={isAdminPage ? "/admin" : "/"} style={{ textDecoration: 'none', display: 'flex' }}>
            <Logo height={scrolled ? (isMobile ? 35 : 40) : (isMobile ? 40 : 50)} />
            {isAdminPage && (
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 1, 
                  fontWeight: 600, 
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Admin
              </Typography>
            )}
          </RouterLink>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 2,
                flex: 1
              }}
            >
              {visibleNavItems.map((item, index) => (
                <Fade in={true} key={item.name} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Button
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      mx: { md: 1, lg: 2 },
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActive(item.path) ? 600 : 400,
                      position: 'relative',
                      letterSpacing: '0.5px',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      ...(isAdminPage && {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }),
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        right: 0,
                        height: 2,
                        bgcolor: 'primary.main',
                        transform: isActive(item.path) ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'right',
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover::after': {
                        transform: 'scaleX(1)',
                        transformOrigin: 'left',
                      },
                    }}
                  >
                    {isAdminPage && item.icon && (
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', mr: 0.5 }}>
                        {item.icon}
                      </Box>
                    )}
                    {item.name}
                  </Button>
                </Fade>
              ))}
            </Box>
          )}

          {/* Right side elements */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Only show these icons for regular users, not admin */}
            {!isAdminPage && (
              <>
                {/* Search Icon */}
                <IconButton
                  color="primary"
                  sx={{ 
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>

                {/* Wishlist Icon */}
                <IconButton
                  color="primary"
                  sx={{ 
                    transition: 'transform 0.2s ease',
                    display: { xs: 'none', sm: 'flex' },
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    }
                  }}
                >
                  <FavoriteIcon />
                </IconButton>

                {/* Cart Icon */}
                <IconButton
                  component={RouterLink}
                  to="/cart"
                  aria-label="shopping cart"
                  color="primary"
                  sx={{ 
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    }
                  }}
                >
                  <Badge 
                    badgeContent={cartItemsCount} 
                    color="warning"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -3,
                        top: 13,
                        border: `2px solid ${theme.palette.background.paper}`,
                        padding: '0 4px',
                      }
                    }}
                  >
                    <CartIcon />
                  </Badge>
                </IconButton>
              </>
            )}

            {/* Admin mode indicator */}
            {isAdminPage && (
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              >
                Back to Store
              </Button>
            )}

            {/* User Menu */}
            {!isMobile && (
              <>
                {isAuthenticated ? (
                  <>
                    <IconButton
                      edge="end"
                      aria-label="account of current user"
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                      sx={{ 
                        ml: 1,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: 'rgba(46, 125, 50, 0.08)',
                        }
                      }}
                    >
                      {user?.avatar ? (
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          sx={{ 
                            width: 32, 
                            height: 32,
                            border: `2px solid ${theme.palette.primary.main}`,
                          }}
                        />
                      ) : (
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: 'primary.main',
                            border: `2px solid ${theme.palette.primary.light}`,
                          }}
                        >
                          {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                      )}
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      keepMounted
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 200 }}
                    >
                      {/* Regular user menu items - only show on regular pages */}
                      {!isAdminPage && (
                        <>
                          <MenuItem
                            component={RouterLink}
                            to="/profile"
                            onClick={handleMenuClose}
                            sx={{
                              fontWeight: 500,
                              letterSpacing: '0.5px',
                            }}
                          >
                            My Account
                          </MenuItem>
                          <MenuItem
                            component={RouterLink}
                            to="/orders"
                            onClick={handleMenuClose}
                            sx={{
                              fontWeight: 500,
                              letterSpacing: '0.5px',
                            }}
                          >
                            My Orders
                          </MenuItem>
                        </>
                      )}
                      
                      {/* Admin section - only on regular pages and for admin users */}
                      {user?.isAdmin && !isAdminPage && (
                        <>
                          <Divider />
                          <MenuItem
                            component={RouterLink}
                            to="/admin"
                            onClick={handleMenuClose}
                            sx={{
                              fontWeight: 500,
                              letterSpacing: '0.5px',
                            }}
                          >
                            <ListItemIcon>
                              <DashboardIcon fontSize="small" />
                            </ListItemIcon>
                            Admin Dashboard
                          </MenuItem>
                        </>
                      )}
                      
                      {/* Back to store - only on admin pages */}
                      {isAdminPage && (
                        <MenuItem
                          component={RouterLink}
                          to="/"
                          onClick={handleMenuClose}
                          sx={{
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                          }}
                        >
                          Back to Store
                        </MenuItem>
                      )}
                      
                      <Divider />
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                          color: 'error.main',
                        }}
                      >
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/login"
                      sx={{ 
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                        textTransform: 'none',
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="primary"
                      sx={{ 
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      Create Account
                    </Button>
                  </Box>
                )}
              </>
            )}

            {/* Mobile menu icon */}
            {isMobile && (
              <IconButton
                edge="start"
                color="primary"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ 
                  ml: 1,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(46, 125, 50, 0.08)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile navigation drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header; 