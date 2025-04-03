import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Grid
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon, 
  Lock as LockIcon,
  NavigateNext as NavigateNextIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GlassMorph, TextReveal, NoiseOverlay, GridBackground } from '../components/AwwwardsEffects';

const LoginPage = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we were redirected from another page
  const from = location.state?.from?.pathname || '/';
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!re.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      // Call login function from AuthContext
      await login(email, password);
      
      // Important: Give a moment for localStorage to be updated
      setTimeout(() => {
        // Get the latest user data from localStorage
        const userStr = localStorage.getItem('user');
        
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            console.log('User data after login:', userData);
            
            // Check if user is admin
            if (userData && userData.isAdmin === true) {
              console.log('Admin user detected, redirecting to admin dashboard');
              navigate('/admin');
            } else {
              console.log('Regular user detected, redirecting to:', from);
              // Navigate to the page the user was trying to access, or home
              navigate(from, { replace: true });
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
            navigate(from, { replace: true });
          }
        } else {
          console.log('No user data found in localStorage after login');
          navigate(from, { replace: true });
        }
      }, 100); // Small delay to ensure localStorage is updated
      
    } catch (error: any) {
      setFormError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        pt: 4,
        pb: 8,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
      }}
    >
      {/* Decorative elements */}
      <GridBackground color={theme.palette.primary.main} size={30} opacity={0.03} />
      <NoiseOverlay opacity={0.03} />
      
      {/* Large circles in background */}
      <Box
        sx={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          top: '-25vw',
          right: '-15vw',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.1)}, ${alpha(theme.palette.secondary.main, 0.03)})`,
          bottom: '-20vw',
          left: '-10vw',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6} lg={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 500, px: { xs: 2, md: 4 } }}>
              {/* Headline section */}
              <Box sx={{ mb: 6, textAlign: { xs: 'center', md: 'left' } }}>
                <TextReveal>
                  <Typography
                    component="h1"
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Welcome Back
                  </Typography>
                </TextReveal>
                
                <TextReveal delay={0.1}>
                  <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 400,
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    Sign in to access your account and explore our premium quality seafood products.
                  </Typography>
                </TextReveal>
              </Box>
              
              {/* Form section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassMorph blur={20} opacity={0.7}>
                  <Box sx={{ p: 4 }}>
                    {formError && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 4,
                          borderRadius: 2,
                          '& .MuiAlert-icon': {
                            alignItems: 'center',
                          }
                        }}
                      >
                        {formError}
                      </Alert>
                    )}
                    
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                      <Box 
                        sx={{ 
                          mb: 3, 
                          position: 'relative',
                          transition: 'transform 0.2s ease-in-out',
                          transform: focused === 'email' ? 'translateY(-4px)' : 'none',
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          fontWeight={500}
                          sx={{ mb: 1, ml: 1 }}
                        >
                          Email Address
                        </Typography>
                        <TextField
                          fullWidth
                          id="email"
                          name="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          autoFocus
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          error={!!emailError}
                          helperText={emailError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon 
                                  color={focused === 'email' ? 'primary' : 'action'} 
                                  sx={{ 
                                    transition: 'color 0.2s ease-in-out',
                                  }} 
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
                              backgroundColor: alpha('#fff', 0.5),
                              backdropFilter: 'blur(4px)',
                              '&:hover': {
                                backgroundColor: alpha('#fff', 0.7),
                              },
                              '&.Mui-focused': {
                                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.15)}`,
                              },
                            },
                          }}
                        />
                      </Box>
                      
                      <Box 
                        sx={{ 
                          mb: 4, 
                          position: 'relative',
                          transition: 'transform 0.2s ease-in-out',
                          transform: focused === 'password' ? 'translateY(-4px)' : 'none',
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          fontWeight={500}
                          sx={{ mb: 1, ml: 1 }}
                        >
                          Password
                        </Typography>
                        <TextField
                          fullWidth
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocused('password')}
                          onBlur={() => setFocused(null)}
                          error={!!passwordError}
                          helperText={passwordError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon 
                                  color={focused === 'password' ? 'primary' : 'action'} 
                                  sx={{ 
                                    transition: 'color 0.2s ease-in-out',
                                  }} 
                                />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
                              backgroundColor: alpha('#fff', 0.5),
                              backdropFilter: 'blur(4px)',
                              '&:hover': {
                                backgroundColor: alpha('#fff', 0.7),
                              },
                              '&.Mui-focused': {
                                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.15)}`,
                              },
                            },
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2, textAlign: 'right' }}>
                        <Link 
                          component={RouterLink} 
                          to="/forgot-password" 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            textDecoration: 'none',
                            fontWeight: 500,
                            transition: 'color 0.2s',
                            '&:hover': {
                              color: theme.palette.primary.main,
                            }
                          }}
                        >
                          Forgot password?
                        </Link>
                      </Box>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          endIcon={!isSubmitting && <ArrowForwardIcon />}
                          sx={{ 
                            py: 1.8,
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: `linear-gradient(120deg, transparent, ${alpha('#fff', 0.2)}, transparent)`,
                              transition: 'all 0.6s ease-in-out',
                            },
                            '&:hover::before': {
                              left: '100%',
                            },
                          }}
                        >
                          {isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </motion.div>
                      
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link 
                          component={RouterLink} 
                          to="/forgot-password" 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: theme.palette.text.secondary,
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            '&:hover': {
                              color: theme.palette.primary.main
                            }
                          }}
                        >
                          Forgot your password?
                        </Link>
                      </Box>
                    </Box>
                  </Box>
                </GlassMorph>
              </motion.div>
              
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" display="inline">
                  Don't have an account?{' '}
                </Typography>
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      transform: 'scaleX(0)',
                      height: '2px',
                      bottom: -2,
                      left: 0,
                      backgroundColor: theme.palette.primary.main,
                      transformOrigin: 'bottom right',
                      transition: 'transform 0.3s ease-out'
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                      transformOrigin: 'bottom left'
                    }
                  }}
                >
                  Create Account
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* Right side - Hidden on mobile */}
          <Grid 
            item 
            md={6} 
            lg={5} 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              pl: 6
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: 500,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="Fresh seafood"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 10s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
                
                {/* Overlay with text */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 4,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    color: 'white',
                  }}
                >
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    Green Sea Foods
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Premium quality sustainable seafood and vegetables
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage; 