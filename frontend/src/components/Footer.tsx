import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link,
  IconButton,
  Divider,
  TextField,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import Logo from './Logo';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    // Here you would normally call an API to handle the subscription
    setEmail('');
    alert('Thanks for subscribing to our newsletter!');
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#fafaf7', py: 8, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: 3 }}>
              <Logo height={45} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Supplying top-quality fresh fish and vegetables to restaurants and food businesses. Reliable supply, competitive pricing, and exceptional service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton
                aria-label="facebook"
                size="small"
                sx={{
                  color: 'text.secondary',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: 'rgba(53, 102, 72, 0.1)'
                  },
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="twitter"
                size="small"
                sx={{
                  color: 'text.secondary',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: 'rgba(53, 102, 72, 0.1)'
                  },
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="instagram"
                size="small"
                sx={{
                  color: 'text.secondary',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: 'rgba(53, 102, 72, 0.1)'
                  },
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="linkedin"
                size="small"
                sx={{
                  color: 'text.secondary',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: 'rgba(53, 102, 72, 0.1)'
                  },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                component={RouterLink}
                to="/"
                color="text.secondary"
                underline="none"
                sx={{ 
                  display: 'inline-block', 
                  transition: 'color 0.2s, transform 0.2s',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/shop"
                color="text.secondary"
                underline="none"
                sx={{ 
                  display: 'inline-block',
                  transition: 'color 0.2s, transform 0.2s',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Shop
              </Link>
              <Link
                component={RouterLink}
                to="/best-sellers"
                color="text.secondary"
                underline="none"
                sx={{ 
                  display: 'inline-block',
                  transition: 'color 0.2s, transform 0.2s',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Best Sellers
              </Link>
              <Link
                component={RouterLink}
                to="/about-us"
                color="text.secondary"
                underline="none"
                sx={{ 
                  display: 'inline-block',
                  transition: 'color 0.2s, transform 0.2s',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateX(3px)'
                  }
                }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/cart"
                color="text.secondary"
                underline="none"
                sx={{ 
                  display: 'inline-block',
                  transition: 'color 0.2s, transform 0.2s',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Shopping Cart
              </Link>
            </Box>
          </Grid>
          
          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationIcon fontSize="small" sx={{ mr: 1.5, mt: 0.3, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">Belgium</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1.5, mt: 0.3, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">+32 3 012344</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <EmailIcon fontSize="small" sx={{ mr: 1.5, mt: 0.3, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">info@greenseafood.be</Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Newsletter or Additional Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
              Subscribe to our newsletter for special deals, recipes, and updates!
            </Typography>
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
              }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Your email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                required
                sx={{
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 50,
                    height: 48,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ 
                  borderRadius: 50,
                  height: 48,
                  px: 3,
                  minWidth: { xs: '100%', sm: 'auto' }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 6, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'center' },
            textAlign: { xs: 'center', md: 'left' },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Green Sea Food. All rights reserved.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center">
            Powered by Green Sea Foods - The #1 Supplier for Fresh Fish and Vegetables
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              underline="none"
              sx={{ 
                fontSize: '0.875rem',
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              underline="none"
              sx={{ 
                fontSize: '0.875rem',
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 