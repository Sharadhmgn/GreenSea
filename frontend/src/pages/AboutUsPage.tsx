import React, { useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Card,
  CardContent,
  Paper,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';

// Team member interface
interface TeamMember {
  name: string;
  position: string;
  image?: string; // Optional image URL
}

const AboutUsPage = () => {
  const theme = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

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
    <Box>
      {/* Hero Section - with Parallax Effect */}
      <Box 
        ref={ref}
        sx={{ 
          height: '90vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            y,
            opacity
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
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
                backgroundColor: alpha(theme.palette.primary.main, 0.6),
              },
            }}
          />
        </motion.div>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3,
                  color: 'white',
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem', lg: '5rem' },
                  lineHeight: { xs: 1.2, md: 1.1 },
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                }}
              >
                About Us
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  maxWidth: '700px', 
                  mx: 'auto',
                  mb: 5,
                  lineHeight: 1.4,
                  color: 'white',
                  fontWeight: 400,
                  opacity: 0.9,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                }}
              >
                Supplying Quality Fish and Vegetables to Businesses
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Box 
                sx={{ 
                  display: 'inline-block',
                  p: '4px 20px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50px',
                  backdropFilter: 'blur(5px)',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }}
              >
                <Typography variant="body1" color="white">
                  Founded in Belgium
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Mission Section - Minimalist with Animated Entry */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 10, md: 16 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 600, 
                    letterSpacing: 2,
                    mb: 2,
                    display: 'block'
                  }}
                >
                  OUR MISSION
                </Typography>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 700,
                    lineHeight: 1.2,
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    letterSpacing: '-0.01em',
                  }}
                >
                  Delivering excellence with every order
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4, 
                    fontSize: '1.125rem', 
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    maxWidth: '500px',
                  }}
                >
                  At Green Sea Foods, we are dedicated to supplying top-quality fresh fish and vegetables to restaurants and food businesses. 
                  With a deep understanding of the food industry, we work closely with our partners to ensure reliable supply, 
                  competitive pricing, and exceptional service.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: 400,
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box
  component="img"
  src="https://images.pexels.com/photos/566344/pexels-photo-566344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  alt="Fresh seafood"
  sx={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.8s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }}
/>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Company Story - With Side Line */}
        <Box 
          sx={{ 
            py: { xs: 10, md: 16 },
            borderLeft: { md: `4px solid ${theme.palette.primary.main}` },
            pl: { md: 8 },
            ml: { md: 2 },
            position: 'relative',
            '&::before': {
              content: { md: '""' },
              position: 'absolute',
              top: 0,
              left: -10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
            },
            '&::after': {
              content: { md: '""' },
              position: 'absolute',
              bottom: 0,
              left: -10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="overline" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 600, 
                letterSpacing: 2,
                mb: 2,
                display: 'block'
              }}
            >
              OUR STORY
            </Typography>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                mb: 4, 
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.01em',
                maxWidth: '700px',
              }}
            >
              From vision to top-quality supplier
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                fontSize: '1.125rem', 
                lineHeight: 1.8,
                color: 'text.secondary',
                maxWidth: '700px',
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
                fontSize: '1.125rem', 
                lineHeight: 1.8,
                color: 'text.secondary',
                maxWidth: '700px',
              }}
            >
              Founded by the same team behind Foodasia, Green Sea Foods continues to uphold the same dedication and excellence 
              that made Foodasia a success. With years of industry experience and strong relationships with our partners, 
              we are committed to providing the best products and service to support your business.
            </Typography>
          </motion.div>
        </Box>

        {/* Team Section - Modern Card Grid */}
        <Box sx={{ py: { xs: 10, md: 16 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="overline" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 600, 
                letterSpacing: 2,
                mb: 2,
                display: 'block',
                textAlign: 'center',
              }}
            >
              OUR LEADERSHIP
            </Typography>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                mb: 2, 
                fontWeight: 700,
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.01em',
              }}
            >
              Meet our team
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 8, 
                fontSize: '1.125rem', 
                lineHeight: 1.8,
                color: 'text.secondary',
                textAlign: 'center',
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Our diverse team of experts is dedicated to delivering excellence in every aspect of our business.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      borderRadius: 3,
                      overflow: 'hidden',
                      bgcolor: 'background.paper',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                        '& .member-avatar': {
                          transform: 'scale(1.05)',
                          boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }
                      },
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 4, 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      <Avatar 
                        className="member-avatar"
                        sx={{ 
                          width: 120, 
                          height: 120,
                          bgcolor: alpha(theme.palette.primary.main, 0.8),
                          color: 'white',
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          mb: 3,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                      <Typography 
                        variant="h5" 
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
                        color="primary"
                        sx={{
                          fontWeight: 500,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                        }}
                      >
                        {member.position}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section - Clean Design with Animations */}
        <Box sx={{ py: { xs: 10, md: 16 }, mb: 4 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 600, 
                    letterSpacing: 2,
                    mb: 2,
                    display: 'block'
                  }}
                >
                  GET IN TOUCH
                </Typography>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 700,
                    lineHeight: 1.2,
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    letterSpacing: '-0.01em',
                  }}
                >
                  Contact us
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 5, 
                    fontSize: '1.125rem', 
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    maxWidth: '500px',
                  }}
                >
                  Have questions about our products or services? We're here to help. 
                  Contact us directly or fill out our online form and we'll get back to you promptly.
                </Typography>
                
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary.main">📞</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Phone</Typography>
                    <Typography variant="body1" color="text.secondary">+32 3 012344</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary.main">✉️</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Email</Typography>
                    <Typography variant="body1" color="text.secondary">info@greenseafood.be</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary.main">📍</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Location</Typography>
                    <Typography variant="body1" color="text.secondary">Belgium</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 5,
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    height: '100%',
                    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 6 }}>
                    Our Commitment
                  </Typography>
                  <Box sx={{ position: 'relative', pl: 4, mb: 4 }}>
  <Typography 
    sx={{ 
      position: 'absolute', 
      left: 0, 
      top: -5,
      fontSize: '2rem',
      color: theme.palette.primary.main,
      fontWeight: 800,
      lineHeight: 1,
      mr: 3
    }}
  >
    01
  </Typography>
  <Typography variant="h6" sx={{ mb: 1, pl: 1 }}>Quality</Typography>
  <Typography variant="body1" color="text.secondary">
    We source only the finest seafood and freshest vegetables.
  </Typography>
</Box>
                  
                  <Box sx={{ position: 'relative', pl: 4, mb: 4 }}>
                    <Typography 
                      sx={{ 
                        position: 'absolute', 
                        left: 0, 
                        top: -5,
                        fontSize: '2rem',
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        lineHeight: 1,
                        mr: 3

                      }}
                    >
                      02
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1, pl: 1  }}>Reliability</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Consistent, on-time delivery you can count on.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ position: 'relative', pl: 4 }}>
                    <Typography 
                      sx={{ 
                        position: 'absolute', 
                        left: 0, 
                        top: -5,
                        fontSize: '2rem',
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                        lineHeight: 1,
                        mr: 3

                      }}
                    >
                      03
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1, pl: 1  }}>Partnership</Typography>
                    <Typography variant="body1" color="text.secondary">
                      We work closely with our clients to understand their needs.
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsPage; 