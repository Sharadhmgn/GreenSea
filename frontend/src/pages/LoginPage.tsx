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
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
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
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          my: 8, 
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
            Sign In
          </Typography>
          
          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
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
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ 
                py: 1.5, 
                mb: 2,
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: 'text.secondary' }}>
                Forgot password?
              </Link>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" display="inline">
                Don't have an account?{' '}
              </Typography>
              <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 600 }}>
                Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 