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
  FormControlLabel
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
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
      // Set user registration info in session storage
      sessionStorage.setItem('isLoggedIn', 'true');
      // Navigate to home page
      navigate('/', { replace: true });
    } catch (error: any) {
      setFormError(error.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          my: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
            borderTop: '4px solid',
            borderColor: 'primary.main',
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            sx={{ 
              mb: 3, 
              fontWeight: 700,
              color: 'primary.main' 
            }}
          >
            Create Account
          </Typography>
          
          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'secondary.main' }}>
              Account Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: 'secondary.main' }}>
              Shipping Address (Optional)
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="street"
                  label="Street Address"
                  name="street"
                  autoComplete="address-line1"
                  value={formData.street}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="apartment"
                  label="Apartment, Suite, Unit, etc."
                  name="apartment"
                  autoComplete="address-line2"
                  value={formData.apartment}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="zip"
                  label="Postal Code"
                  name="zip"
                  autoComplete="postal-code"
                  value={formData.zip}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="country"
                  label="Country"
                  name="country"
                  autoComplete="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={agreeToTerms} 
                  onChange={(e) => setAgreeToTerms(e.target.checked)} 
                  color="primary"
                  required
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link component={RouterLink} to="/terms" sx={{ fontWeight: 600 }}>
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link component={RouterLink} to="/privacy" sx={{ fontWeight: 600 }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />
            {errors.terms && (
              <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                {errors.terms}
              </Typography>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ 
                py: 1.5, 
                mt: 3,
                mb: 2,
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" display="inline">
                Already have an account?{' '}
              </Typography>
              <Link component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 600 }}>
                Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage; 