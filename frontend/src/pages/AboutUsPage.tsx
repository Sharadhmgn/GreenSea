import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';

// Team member interface
interface TeamMember {
  name: string;
  position: string;
  image?: string; // Optional image URL
}

const AboutUsPage = () => {
  const theme = useTheme();

  // Company team members from greenseafood.be
  const teamMembers: TeamMember[] = [
    { name: 'Bhim Joshi (Roashan)', position: 'Managing Director' },
    { name: 'Ananta Wasti', position: 'Director' },
    { name: 'Anil Dahal', position: 'Director' },
    { name: 'Kasi Danai', position: 'Director' },
    { name: 'Yam Niraula', position: 'Director' },
    { name: 'Madan Dawadi', position: 'Director' },
    { name: 'Shiva Baruwal', position: 'Director' },
  ];

  return (
    <Container maxWidth="lg" sx={{ my: 6 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 6,
          pt: 8,
          pb: 10,
          backgroundColor: 'rgba(46, 125, 50, 0.04)',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'url("https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(46, 125, 50, 0.7)',
            zIndex: 1,
          },
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            mb: 3,
            position: 'relative',
            zIndex: 2,
            color: 'white',
          }}
        >
          About Us
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            mb: 2,
            lineHeight: 1.6,
            color: 'white',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Supplying Quality Fish and Vegetables to Businesses
        </Typography>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 600 }}>
          Our Mission
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            fontSize: '1.1rem', 
            lineHeight: 1.8,
            color: 'text.secondary'
          }}
        >
          At Green Sea Foods, we are dedicated to supplying top-quality fresh fish and vegetables to restaurants and food businesses. 
          With a deep understanding of the food industry, we work closely with our partners to ensure reliable supply, 
          competitive pricing, and exceptional service. Whether you need fresh produce or premium fish, 
          Green Sea Foods is your go-to supplier for consistent excellence.
        </Typography>
      </Box>

      {/* Company History */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 600 }}>
          Our Story
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            fontSize: '1.1rem', 
            lineHeight: 1.8,
            color: 'text.secondary'
          }}
        >
          Green Sea Foods was born from the success of Foodasia Belgium, where we built a strong reputation as a trusted 
          wholesaler of quality food products. After seeing the growing demand from our partners, we decided to expand 
          our expertise into a new venture—Green Sea Foods.
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            fontSize: '1.1rem', 
            lineHeight: 1.8,
            color: 'text.secondary'
          }}
        >
          Founded by the same team behind Foodasia, Green Sea Foods continues to uphold the same dedication and excellence 
          that made Foodasia a success. With years of industry experience and strong relationships with our partners, 
          we are committed to providing the best products and service to support your business.
        </Typography>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" sx={{ mb: 5, fontWeight: 600 }}>
          Our Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
                }}
              >
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100,
                      bgcolor: `primary.light`,
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      mb: 2,
                      border: '4px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontWeight: 500
                    }}
                  >
                    {member.position}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 600 }}>
          Contact Us
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4,
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                height: '100%',
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Get In Touch
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Phone:</strong> +32 3 012344
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Email:</strong> info@greenseafood.be
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> Belgium
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4,
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'secondary.main',
                height: '100%',
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Business Hours
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Saturday:</strong> 10:00 AM - 4:00 PM
              </Typography>
              <Typography variant="body1">
                <strong>Sunday:</strong> Closed
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutUsPage; 