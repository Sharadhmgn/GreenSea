import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Green Sea Foods
            </Typography>
            <Typography variant="body2" paragraph>
              Supplying top-quality fresh fish and vegetables to restaurants and food businesses. Reliable supply, competitive pricing, and exceptional service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                aria-label="facebook"
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { color: 'secondary.main' },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                aria-label="twitter"
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { color: 'secondary.main' },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                aria-label="instagram"
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { color: 'secondary.main' },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                aria-label="linkedin"
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { color: 'secondary.main' },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/shop"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Shop
            </Link>
            <Link
              component={RouterLink}
              to="/best-sellers"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Best Sellers
            </Link>
            <Link
              component={RouterLink}
              to="/about-us"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              About Us
            </Link>
            <Link
              component={RouterLink}
              to="/cart"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Shopping Cart
            </Link>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">Belgium</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">+32 3 012344</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">info@greenseafood.be</Typography>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Newsletter
            </Typography>
            <Typography variant="body2" paragraph>
              Subscribe to our newsletter for special deals, recipes, and updates!
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                size="small"
                fullWidth
                placeholder="Your email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                required
                sx={{
                  mb: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Green Sea Food. All rights reserved.
          </Typography>
          <Box>
            <Link
              component={RouterLink}
              to="/privacy"
              color="inherit"
              underline="hover"
              sx={{ mr: 2 }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="inherit"
              underline="hover"
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2, opacity: 0.8 }}>
          Powered by Green Sea Foods - The #1 Supplier for Fresh Fish and Vegetables
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 