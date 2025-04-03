import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products?featured=true');
        
        // Transform backend product model to match our frontend Product interface
        const products = response.data.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category.name || product.category,
          countInStock: product.countInStock,
          rating: product.rating,
        }));
        
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        // Use dummy data for now
        setFeaturedProducts([
          {
            id: '1',
            name: 'Fresh Atlantic Salmon',
            description: 'Premium wild-caught Atlantic salmon',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            category: 'Fish',
            countInStock: 15,
            rating: 4.8,
          },
          {
            id: '2',
            name: 'Jumbo Shrimp',
            description: 'Large, succulent shrimp perfect for grilling',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1565680018160-d349fe53de21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
            category: 'Shellfish',
            countInStock: 25,
            rating: 4.5,
          },
          {
            id: '3',
            name: 'Fresh Oysters',
            description: 'Freshly harvested oysters, perfect for raw consumption',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1642166805142-0426a75902e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            category: 'Shellfish',
            countInStock: 20,
            rating: 4.7,
          },
          {
            id: '4',
            name: 'Lobster Tails',
            description: 'Premium lobster tails, perfect for special occasions',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1559564207-09c99dc78a70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
            category: 'Shellfish',
            countInStock: 10,
            rating: 4.9,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <Box>
      {/* Hero Section - Updated with more premium, modern look */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '80vh', md: '90vh' },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Hero Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1,
            },
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
            }}
          />
        </Box>
        
        {/* Hero Content */}
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12} md={7} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: 4,
                    p: { xs: 4, md: 6 },
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography
                    component="h1"
                    variant="h2"
                    fontWeight="800"
                    sx={{
                      mb: 3,
                      color: 'primary.main',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    Premium Quality <br />
                    Seafood & Vegetables
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ 
                      mb: 4, 
                      fontWeight: 400, 
                      color: 'text.secondary',
                      fontSize: { xs: '1rem', md: '1.2rem' } 
                    }}
                  >
                    Supplying top-quality fresh fish and vegetables to restaurants and food businesses. Reliable supply, competitive pricing, and exceptional service.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      component={RouterLink}
                      to="/shop"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ 
                        py: 1.5, 
                        px: 4, 
                        borderRadius: 50,
                        fontSize: '1rem',
                      }}
                    >
                      Shop Now
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/about-us"
                      variant="outlined"
                      color="primary"
                      size="large"
                      sx={{ 
                        py: 1.5, 
                        px: 4, 
                        borderRadius: 50,
                        fontSize: '1rem'
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: 10, bgcolor: '#f8f8f5' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              component="h2"
              variant="h3"
              align="center"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 2 }}
            >
              Why Choose Green Sea Foods?
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary" 
              sx={{ maxWidth: 800, mx: 'auto', mb: 8 }}
            >
              We're dedicated to providing the freshest, highest-quality products to our customers
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {[
              {
                title: 'Premium Quality',
                description: 'Hand-selected seafood and vegetables meeting our strict quality standards',
                icon: '🏆',
              },
              {
                title: 'Sustainably Sourced',
                description: 'Responsibly sourced products with environmental consciousness at our core',
                icon: '🌱',
              },
              {
                title: 'Same-Day Delivery',
                description: 'Fresh products delivered to your door on the same day when ordered before noon',
                icon: '🚚',
              },
              {
                title: 'Expert Selection',
                description: 'Our team of experts selects only the finest products for your business',
                icon: '👨‍🍳',
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      bgcolor: 'white',
                      p: 4,
                      borderRadius: 4,
                      height: '100%',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h1" sx={{ mb: 2, fontSize: '3rem' }}>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section - Updated with better layout and animations */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              component="h2"
              variant="h3"
              align="center"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 1 }}
            >
              Featured Products
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary" 
              sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
            >
              Discover our selection of premium quality seafood and vegetables
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {loading
              ? Array.from(new Array(4)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Skeleton variant="rectangular" height={240} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" height={28} width="80%" />
                        <Skeleton variant="text" height={20} width="60%" />
                        <Skeleton variant="text" height={20} width="40%" />
                      </CardContent>
                      <CardActions>
                        <Skeleton variant="rectangular" height={36} width="100%" />
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              : featuredProducts.map((product, index) => (
                  <Grid item key={product.id} xs={12} sm={6} md={3}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          borderRadius: 4,
                          boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                          },
                        }}
                      >
                        <Box sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            image={product.image}
                            alt={product.name}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-start',
                              mb: 1
                            }}
                          >
                            <Typography 
                              variant="subtitle1" 
                              component="h3" 
                              fontWeight="bold"
                              sx={{ fontSize: '1.1rem' }}
                            >
                              {product.name}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              color="primary" 
                              fontWeight="bold"
                              sx={{ ml: 1 }}
                            >
                              ${product.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={product.rating} precision={0.5} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                              {product.rating}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              mb: 2
                            }}
                          >
                            {product.description}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ p: 3, pt: 0 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.countInStock === 0}
                            sx={{ borderRadius: 50 }}
                          >
                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button 
              component={RouterLink} 
              to="/shop" 
              variant="outlined" 
              color="primary" 
              size="large"
              sx={{ borderRadius: 50, px: 4 }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: '#f8f8f5' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              component="h2"
              variant="h3"
              align="center"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 1 }}
            >
              What Our Customers Say
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary" 
              sx={{ maxWidth: 800, mx: 'auto', mb: 8 }}
            >
              Trusted by restaurants and food businesses throughout the region
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {[
              {
                quote: "Green Sea Foods has been our trusted supplier for over 3 years. Their seafood quality is exceptional and delivery is always reliable.",
                author: "Chef Michel Dubois",
                role: "Executive Chef, Le Poisson Restaurant"
              },
              {
                quote: "The freshness of their produce speaks for itself. Our customers can taste the difference in every dish we prepare.",
                author: "Sarah Johnson",
                role: "Owner, The Green Table Bistro"
              },
              {
                quote: "Their customer service is as impressive as their product quality. Any issue we've had was resolved immediately.",
                author: "David Chen",
                role: "Purchasing Manager, Ocean View Hotel"
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      bgcolor: 'white',
                      p: 4,
                      borderRadius: 4,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="h1" sx={{ color: 'primary.light', mb: 2, fontSize: '3rem' }}>
                      "
                    </Typography>
                    <Typography variant="body1" sx={{ flex: 1, mb: 3, fontStyle: 'italic' }}>
                      {testimonial.quote}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box 
        sx={{ 
          py: 10,
          backgroundImage: 'linear-gradient(45deg, #356648 0%, #4a7a5a 100%)',
          color: 'white' 
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              sx={{ 
                textAlign: 'center',
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Ready to experience the difference?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Start your journey with Green Sea Foods today and discover why we're the preferred supplier for quality seafood and vegetables.
              </Typography>
              <Button
                component={RouterLink}
                to="/shop"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ 
                  borderRadius: 50, 
                  px: 5, 
                  py: 1.5,
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'white',
                    opacity: 0.9
                  }
                }}
              >
                Shop Now
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 