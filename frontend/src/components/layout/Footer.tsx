import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Stack,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand & Description */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              GREEN SEA FOODS
            </Typography>
            <Typography variant="body2" mb={2}>
              Premium quality seafood delivered to your door. Fresh, sustainable, and delicious.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box>
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
                to="/about" 
                color="inherit" 
                underline="hover"
                sx={{ display: 'block', mb: 1 }}
              >
                About Us
              </Link>
              <Link 
                component={RouterLink} 
                to="/contact" 
                color="inherit" 
                underline="hover"
                sx={{ display: 'block', mb: 1 }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">+32 3 012344</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2">info@greenseafood.be</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Antwerp, Belgium
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />
        
        <Typography 
          variant="body2" 
          align="center"
          sx={{ opacity: 0.8 }}
        >
          © {new Date().getFullYear()} Green Sea Foods. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 