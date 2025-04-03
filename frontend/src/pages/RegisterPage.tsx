import React, { useState } from 'react';
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
  Grid,
  Checkbox,
  FormControlLabel,
  useTheme,
  alpha
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  Visibility, 
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GlassMorph, TextReveal, NoiseOverlay, GridBackground } from '../components/AwwwardsEffects';

const RegisterPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    apartment: '',
    zip: '',
    city: '',
    country: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name) newErrors.name = 'Name is required';
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone validation
    if (formData.phone && !/^\+?[0-9\s-()]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Terms agreement
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        address: {
          street: formData.street || undefined,
          apartment: formData.apartment || undefined,
          zip: formData.zip || undefined,
          city: formData.city || undefined,
          country: formData.country || undefined,
        }
      };
      
      await register(registerData);
      // Navigate to home page
      navigate('/', { replace: true });
    } catch (error: any) {
      setFormError(error.message || 'Failed to register. Please try again.');
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
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 580, px: { xs: 2, md: 4 } }}>
              {/* Headline section */}
              <Box sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
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
                    Create Account
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
                    Sign up to start shopping premium quality seafood products and vegetables
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
                      <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{ 
                          mb: 3,
                          color: 'primary.main'
                        }}
                      >
                        Account Information
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {/* Name Field */}
                        <Grid item xs={12}>
                          <Box 
                            sx={{ 
                              mb: 2, 
                              position: 'relative',
                              transition: 'transform 0.2s ease-in-out',
                              transform: focused === 'name' ? 'translateY(-4px)' : 'none',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              fontWeight={500}
                              sx={{ mb: 1, ml: 1 }}
                            >
                              Full Name
                            </Typography>
                            <TextField
                              fullWidth
                              id="name"
                              name="name"
                              autoComplete="name"
                              placeholder="Your full name"
                              autoFocus
                              value={formData.name}
                              onChange={handleChange}
                              onFocus={() => setFocused('name')}
                              onBlur={() => setFocused(null)}
                              error={!!errors.name}
                              helperText={errors.name}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon 
                                      color={focused === 'name' ? 'primary' : 'action'} 
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
                        </Grid>
                        
                        {/* Email Field */}
                        <Grid item xs={12} sm={6}>
                          <Box 
                            sx={{ 
                              mb: 2, 
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
                              value={formData.email}
                              onChange={handleChange}
                              onFocus={() => setFocused('email')}
                              onBlur={() => setFocused(null)}
                              error={!!errors.email}
                              helperText={errors.email}
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
                        </Grid>
                        
                        {/* Phone Field */}
                        <Grid item xs={12} sm={6}>
                          <Box 
                            sx={{ 
                              mb: 2, 
                              position: 'relative',
                              transition: 'transform 0.2s ease-in-out',
                              transform: focused === 'phone' ? 'translateY(-4px)' : 'none',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              fontWeight={500}
                              sx={{ mb: 1, ml: 1 }}
                            >
                              Phone Number (Optional)
                            </Typography>
                            <TextField
                              fullWidth
                              id="phone"
                              name="phone"
                              autoComplete="tel"
                              placeholder="+1 (555) 123-4567"
                              value={formData.phone}
                              onChange={handleChange}
                              onFocus={() => setFocused('phone')}
                              onBlur={() => setFocused(null)}
                              error={!!errors.phone}
                              helperText={errors.phone}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon 
                                      color={focused === 'phone' ? 'primary' : 'action'} 
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
                        </Grid>
                        
                        {/* Password Field */}
                        <Grid item xs={12} sm={6}>
                          <Box 
                            sx={{ 
                              mb: 2, 
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
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleChange}
                              onFocus={() => setFocused('password')}
                              onBlur={() => setFocused(null)}
                              error={!!errors.password}
                              helperText={errors.password}
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
                        </Grid>
                        
                        {/* Confirm Password Field */}
                        <Grid item xs={12} sm={6}>
                          <Box 
                            sx={{ 
                              mb: 2, 
                              position: 'relative',
                              transition: 'transform 0.2s ease-in-out',
                              transform: focused === 'confirmPassword' ? 'translateY(-4px)' : 'none',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              fontWeight={500}
                              sx={{ mb: 1, ml: 1 }}
                            >
                              Confirm Password
                            </Typography>
                            <TextField
                              fullWidth
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="••••••••"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              onFocus={() => setFocused('confirmPassword')}
                              onBlur={() => setFocused(null)}
                              error={!!errors.confirmPassword}
                              helperText={errors.confirmPassword}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon 
                                      color={focused === 'confirmPassword' ? 'primary' : 'action'} 
                                      sx={{ 
                                        transition: 'color 0.2s ease-in-out',
                                      }} 
                                    />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle confirm password visibility"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      edge="end"
                                      sx={{ color: 'text.secondary' }}
                                    >
                                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                        </Grid>
                      </Grid>
                      
                      <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{ 
                          mt: 4,
                          mb: 3,
                          color: 'primary.main'
                        }}
                      >
                        Shipping Address (Optional)
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {/* Street Field */}
                        <Grid item xs={12}>
                          <Box 
                            sx={{ 
                              mb: 2, 
                              position: 'relative',
                              transition: 'transform 0.2s ease-in-out',
                              transform: focused === 'street' ? 'translateY(-4px)' : 'none',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              fontWeight={500}
                              sx={{ mb: 1, ml: 1 }}
                            >
                              Street Address
                            </Typography>
                            <TextField
                              fullWidth
                              id="street"
                              name="street"
                              autoComplete="address-line1"
                              placeholder="123 Main St"
                              value={formData.street}
                              onChange={handleChange}
                              onFocus={() => setFocused('street')}
                              onBlur={() => setFocused(null)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <HomeIcon 
                                      color={focused === 'street' ? 'primary' : 'action'} 
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
                        </Grid>
                        
                        {/* City and Zip */}
                        <Grid item xs={12} sm={6}>
                          <Box 
                            sx={{ 
                              mb: 2, 
                              position: 'relative',
                              transition: 'transform 0.2s ease-in-out',
                              transform: focused === 'city' ? 'translateY(-4px)' : 'none',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              fontWeight={500}
                              sx={{ mb: 1, ml: 1 }}
                            >
                              City
                            </Typography>
                            <TextField
                              fullWidth
                              id="city"
                              name="city"
                              autoComplete="address-level2"
                              placeholder="Your City"
                              value={formData.city}
                              onChange={handleChange}
                              onFocus={() => setFocused('city')}
                              onBlur={() => setFocused(null)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocationCityIcon 
                                      color={focused === 'city' ? 'primary' : 'action'} 
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
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box 
                            sx={{ 
                              mb: 2, 
                              position: 'relative',
                              transition: 'transform 0.2s ease-in-out',
                              transform: focused === 'country' ? 'translateY(-4px)' : 'none',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              fontWeight={500}
                              sx={{ mb: 1, ml: 1 }}
                            >
                              Country
                            </Typography>
                            <TextField
                              fullWidth
                              id="country"
                              name="country"
                              autoComplete="country"
                              placeholder="Your Country"
                              value={formData.country}
                              onChange={handleChange}
                              onFocus={() => setFocused('country')}
                              onBlur={() => setFocused(null)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PublicIcon 
                                      color={focused === 'country' ? 'primary' : 'action'} 
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
                        </Grid>
                      </Grid>
                      
                      <Box mt={3}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={agreeToTerms} 
                              onChange={(e) => setAgreeToTerms(e.target.checked)} 
                              color="primary"
                              required
                              sx={{
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2">
                              I agree to the{' '}
                              <Link 
                                component={RouterLink} 
                                to="/terms" 
                                sx={{ 
                                  fontWeight: 600, 
                                  color: theme.palette.primary.main,
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
                                Terms of Service
                              </Link>
                              {' '}and{' '}
                              <Link 
                                component={RouterLink} 
                                to="/privacy" 
                                sx={{ 
                                  fontWeight: 600, 
                                  color: theme.palette.primary.main,
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
                                Privacy Policy
                              </Link>
                            </Typography>
                          }
                        />
                        {errors.terms && (
                          <Typography color="error" variant="caption" sx={{ ml: 4 }}>
                            {errors.terms}
                          </Typography>
                        )}
                      </Box>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ marginTop: 24 }}
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
                            'Create Account'
                          )}
                        </Button>
                      </motion.div>
                      
                      <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" display="inline">
                          Already have an account?{' '}
                        </Typography>
                        <Link 
                          component={RouterLink} 
                          to="/login" 
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
                          Sign In
                        </Link>
                      </Box>
                    </Box>
                  </Box>
                </GlassMorph>
              </motion.div>
            </Box>
          </Grid>
          
          {/* Right side - Hidden on mobile */}
          <Grid 
            item 
            md={6} 
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
                  height: 580,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1569058242253-92a6e3d41aea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="Fresh vegetables"
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
                    Join our community of health-conscious seafood and vegetable enthusiasts
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

export default RegisterPage; 