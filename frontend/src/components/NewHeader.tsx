import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  useScrollTrigger,
  Slide,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Home as HomeIcon,
  ShoppingBag as ShopIcon,
  Info as InfoIcon,
  Star as StarIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassMorph, NoiseOverlay } from './AwwwardsEffects';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

// Hidden on scroll component
function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Interfaces for typed props
interface NavItem {
  title: string;
  path: string;
  icon?: React.ElementType;
  children?: NavItem[];
}

const NewHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const userMenuAnchorRef = useRef<HTMLButtonElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Navigation items
  const navItems: NavItem[] = [
    { title: 'Home', path: '/', icon: HomeIcon },
    { 
      title: 'Shop', 
      path: '/shop', 
      icon: ShopIcon,
      children: [
        { title: 'All Products', path: '/shop' },
        { title: 'Best Sellers', path: '/best-sellers' },
        { title: 'Seafood', path: '/shop?category=Seafood' },
        { title: 'Vegetables', path: '/shop?category=Vegetables' },
      ]
    },
    { title: 'Best Sellers', path: '/best-sellers', icon: StarIcon },
    { title: 'About Us', path: '/about-us', icon: InfoIcon },
  ];
  
  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);
  
  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchValue = searchInputRef.current?.value || '';
    if (searchValue.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };
  
  // Handle user logout
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };
  
  // Get total quantity of items in cart
  const getTotalQuantity = () => {
    return itemCount;
  };
  
  
  // Check if a nav item is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Handle click on menu item with children
  const handleMenuItemHover = (item: NavItem | null) => {
    if (item && item.children) {
      setActiveMenuItem(item.title);
    } else {
      setActiveMenuItem(null);
    }
  };
  
  // Mobile drawer content
  const mobileDrawerContent = (
    <Box sx={{ width: '100%', maxWidth: 350, pt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
        <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          <Logo height={40} />
        </Box>
        <IconButton
          onClick={() => setMobileOpen(false)}
          sx={{ color: 'text.primary' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ px: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          <input
            ref={searchInputRef}
            placeholder="Search products..."
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              background: 'transparent',
              fontSize: '0.95rem',
            }}
          />
          <IconButton type="submit" size="small" sx={{ ml: 1 }}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.title}>
            {item.children ? (
              <>
                <ListItem 
                  disablePadding
                  sx={{ 
                    mb: 1, 
                    borderRadius: 2, 
                    backgroundColor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                  }}
                >
                  <ListItemButton 
                    onClick={() => navigate(item.path)}
                    sx={{ borderRadius: 2 }}
                  >
                    {item.icon && <item.icon sx={{ mr: 2, color: isActive(item.path) ? 'primary.main' : 'text.secondary' }} />}
                    <ListItemText 
                      primary={item.title} 
                      primaryTypographyProps={{ 
                        fontWeight: isActive(item.path) ? 600 : 500,
                        color: isActive(item.path) ? 'primary.main' : 'inherit'
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
                
                <List disablePadding sx={{ ml: 6, mb: 2 }}>
                  {item.children.map((child) => (
                    <ListItem key={child.title} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton 
                        component={RouterLink} 
                        to={child.path}
                        sx={{ 
                          py: 1, 
                          borderRadius: 2, 
                          backgroundColor: isActive(child.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                        }}
                      >
                        <ArrowRightIcon 
                          fontSize="small" 
                          sx={{ 
                            mr: 1, 
                            color: isActive(child.path) ? 'primary.main' : 'text.secondary',
                            fontSize: '0.8rem'
                          }} 
                        />
                        <ListItemText 
                          primary={child.title} 
                          primaryTypographyProps={{ 
                            fontWeight: isActive(child.path) ? 600 : 'normal',
                            color: isActive(child.path) ? 'primary.main' : 'text.secondary',
                            fontSize: '0.95rem'
                          }} 
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <ListItem 
                disablePadding
                sx={{ 
                  mb: 1, 
                  borderRadius: 2, 
                  backgroundColor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                }}
              >
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path}
                  sx={{ borderRadius: 2 }}
                >
                  {item.icon && <item.icon sx={{ mr: 2, color: isActive(item.path) ? 'primary.main' : 'text.secondary' }} />}
                  <ListItemText 
                    primary={item.title} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive(item.path) ? 600 : 500,
                      color: isActive(item.path) ? 'primary.main' : 'inherit'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ px: 3, mb: 3 }}>
        {isAuthenticated ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: theme.palette.primary.main,
                  mr: 2
                }}
              >
                {user?.name?.charAt(0) || <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              sx={{ borderRadius: 2, py: 1 }}
            >
              Logout
            </Button>
            {user?.isAdmin && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/admin"
                sx={{ mt: 1, borderRadius: 2, py: 1 }}
              >
                Admin Dashboard
              </Button>
            )}
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/login"
              startIcon={<LoginIcon />}
              sx={{ py: 1, borderRadius: 2 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/register"
              sx={{ py: 1, borderRadius: 2 }}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
  
  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: isScrolled ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <Container maxWidth="xl">
            <Toolbar 
              disableGutters 
              sx={{ 
                height: isScrolled ? 70 : 90, 
                transition: 'height 0.3s ease'
              }}
            >
              {/* Mobile View */}
              {isMobile && (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={() => setMobileOpen(true)}
                    sx={{ mr: 2, color: 'text.primary' }}
                  >
                    <MenuIcon />
                  </IconButton>
                  
                  <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box component={RouterLink} to="/" sx={{ display: 'flex', textDecoration: 'none' }}>
                      <Logo height={40} />
                    </Box>
                  </Box>
                  
                  {/* Cart Icon */}
                  <Box>
                    <IconButton
                      component={RouterLink}
                      to="/cart"
                      sx={{ ml: 1, color: 'text.primary' }}
                    >
                      <Badge badgeContent={getTotalQuantity()} color="primary">
                        <CartIcon />
                      </Badge>
                    </IconButton>
                  </Box>
                </>
              )}
              
              {/* Desktop View */}
              {!isMobile && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box component={RouterLink} to="/" sx={{ display: 'flex', textDecoration: 'none', mr: 5 }}>
                        <Logo height={45} />
                      </Box>
                    </motion.div>
                    
                    {/* Navigation Items */}
                    <Box sx={{ display: 'flex', height: '100%' }}>
                      {navItems.map((item) => (
                        <Box
                          key={item.title}
                          onMouseEnter={() => handleMenuItemHover(item)}
                          onMouseLeave={() => handleMenuItemHover(null)}
                          sx={{ position: 'relative' }}
                        >
                          <Button
                            component={RouterLink}
                            to={item.path}
                            sx={{
                              color: isActive(item.path) ? 'primary.main' : 'text.primary',
                              fontWeight: isActive(item.path) ? 600 : 500,
                              fontSize: '1rem',
                              mx: 1,
                              py: 3,
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: isActive(item.path) ? '100%' : '0%',
                                height: '2px',
                                bottom: isScrolled ? 20 : 25,
                                left: 0,
                                backgroundColor: 'primary.main',
                                transition: 'width 0.3s ease'
                              },
                              '&:hover::after': {
                                width: '100%'
                              }
                            }}
                            endIcon={item.children && <ArrowDownIcon sx={{ fontSize: '0.8rem', transition: 'transform 0.2s ease', transform: activeMenuItem === item.title ? 'rotate(180deg)' : 'rotate(0)' }} />}
                          >
                            {item.title}
                          </Button>
                          
                          {/* Dropdown Menu */}
                          {item.children && (
                            <AnimatePresence>
                              {activeMenuItem === item.title && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    zIndex: 1000,
                                    minWidth: 200,
                                  }}
                                >
                                  <GlassMorph blur={20} opacity={0.9}>
                                    <Box sx={{ p: 1, borderRadius: 2 }}>
                                      {item.children.map((child) => (
                                        <Button
                                          key={child.title}
                                          component={RouterLink}
                                          to={child.path}
                                          fullWidth
                                          sx={{
                                            justifyContent: 'flex-start',
                                            py: 1,
                                            px: 2,
                                            color: isActive(child.path) ? 'primary.main' : 'text.primary',
                                            fontWeight: isActive(child.path) ? 600 : 400,
                                            fontSize: '0.95rem',
                                            borderRadius: 1.5,
                                            '&:hover': {
                                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                            }
                                          }}
                                          startIcon={<ArrowRightIcon sx={{ fontSize: '0.8rem' }} />}
                                        >
                                          {child.title}
                                        </Button>
                                      ))}
                                    </Box>
                                  </GlassMorph>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  
                  {/* Right side items */}
                  <Box sx={{ flexGrow: 1 }} />
                  
                  {/* Search */}
                  <Box sx={{ mr: 2, position: 'relative' }}>
                    <motion.div
                      animate={{ width: searchOpen ? 240 : 40 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <Box 
                        component="form"
                        onSubmit={handleSearchSubmit}
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          border: searchOpen ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}` : 'none',
                          borderRadius: '50px',
                          py: searchOpen ? 0.5 : 0,
                          px: searchOpen ? 2 : 0,
                          transition: 'all 0.3s ease',
                          backgroundColor: searchOpen ? alpha(theme.palette.background.paper, 0.9) : 'transparent',
                          backdropFilter: searchOpen ? 'blur(10px)' : 'none',
                        }}
                      >
                        {searchOpen && (
                          <input
                            ref={searchInputRef}
                            placeholder="Search products..."
                            style={{
                              border: 'none',
                              outline: 'none',
                              width: '100%',
                              background: 'transparent',
                              fontSize: '0.9rem',
                              padding: '4px 0',
                            }}
                          />
                        )}
                        <IconButton
                          sx={{ color: searchOpen ? 'primary.main' : 'text.primary' }}
                          onClick={() => setSearchOpen(!searchOpen)}
                          type={searchOpen ? 'submit' : 'button'}
                        >
                          <SearchIcon />
                        </IconButton>
                      </Box>
                    </motion.div>
                  </Box>
                  
                  {/* Cart */}
                  <Box sx={{ mr: 2 }}>
                    <Tooltip title="Cart">
                      <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/cart"
                        color="primary"
                        sx={{ 
                          borderRadius: '50px',
                          backgroundColor: alpha(theme.palette.background.paper, 0.7),
                          backdropFilter: 'blur(10px)',
                          px: 2,
                        }}
                        startIcon={
                          <Badge badgeContent={getTotalQuantity()} color="primary">
                            <CartIcon />
                          </Badge>
                        }
                      >
                        {!isSmall && 'Cart'}
                      </Button>
                    </Tooltip>
                  </Box>
                  
                  {/* User Account */}
                  <Box>
                    {isAuthenticated ? (
                      <>
                        <Button
                          ref={userMenuAnchorRef}
                          onClick={() => setUserMenuOpen(!userMenuOpen)}
                          sx={{ 
                            textTransform: 'none',
                            backgroundColor: alpha(theme.palette.background.paper, 0.7),
                            backdropFilter: 'blur(10px)',
                            px: 2,
                            py: 1,
                            borderRadius: '50px',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          }}
                          endIcon={<ArrowDownIcon sx={{ 
                            transition: 'transform 0.2s ease', 
                            transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)' 
                          }} />}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                bgcolor: theme.palette.primary.main,
                                fontSize: '0.8rem',
                                mr: 1
                              }}
                            >
                              {user?.name?.charAt(0) || <PersonIcon sx={{ fontSize: '1rem' }} />}
                            </Avatar>
                            {!isSmall && (
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {user?.name?.split(' ')[0] || 'User'}
                              </Typography>
                            )}
                          </Box>
                        </Button>
                        
                        <Menu
                          anchorEl={userMenuAnchorRef.current}
                          open={userMenuOpen}
                          onClose={() => setUserMenuOpen(false)}
                          PaperProps={{
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.10))',
                              mt: 1.5,
                              borderRadius: 2,
                              width: 200,
                              backgroundColor: alpha(theme.palette.background.paper, 0.9),
                              backdropFilter: 'blur(10px)',
                              '& .MuiMenuItem-root': {
                                px: 2,
                                py: 1.5,
                                borderRadius: 1,
                                margin: '2px 4px',
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                              },
                              '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: alpha(theme.palette.background.paper, 0.9),
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          }}
                          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                          <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user?.email}
                            </Typography>
                          </Box>
                          
                          <Divider sx={{ my: 1 }} />
                          
                          {user?.isAdmin && (
                            <MenuItem 
                              component={RouterLink} 
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Admin Dashboard
                            </MenuItem>
                          )}
                          
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          component={RouterLink}
                          to="/login"
                          sx={{ borderRadius: '50px' }}
                        >
                          Login
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          component={RouterLink}
                          to="/register"
                          sx={{ borderRadius: '50px' }}
                        >
                          Register
                        </Button>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 350,
            backgroundColor: alpha(theme.palette.background.paper, 0.98),
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        {mobileDrawerContent}
      </Drawer>
      
      {/* Spacing to prevent content from being hidden under AppBar */}
      <Toolbar sx={{ height: { xs: 70, md: 90 } }} />
    </>
  );
};

export default NewHeader; 