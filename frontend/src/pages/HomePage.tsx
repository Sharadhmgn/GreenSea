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
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  component="h1"
                  variant={isMobile ? 'h3' : 'h2'}
                  fontWeight="bold"
                  gutterBottom
                >
                  Fresh Seafood Delivered To Your Door
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, fontWeight: 'normal', maxWidth: '80%' }}
                >
                  Premium quality seafood, sustainably sourced and delivered fresh to your home.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/shop"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ py: 1.5, px: 4, borderRadius: 2 }}
                >
                  Shop Now
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="Fresh seafood"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: 4,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          component="h2"
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Featured Products
        </Typography>

        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(4)).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Skeleton variant="rectangular" height={200} />
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
            : featuredProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={3}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * featuredProducts.indexOf(product) }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.5} size="small" readOnly />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {product.rating}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {product.description}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${product.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.countInStock === 0}
                        >
                          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            component={RouterLink}
            to="/shop"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ py: 1.5, px: 4, borderRadius: 2 }}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1617733033509-64045e7a2937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="Fishing boat"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h4" fontWeight="bold" gutterBottom>
                About Green Sea Foods
              </Typography>
              <Typography variant="body1" paragraph>
                At Green Sea Foods, we are passionate about bringing the freshest and most sustainable seafood to your table. Founded with a mission to connect seafood lovers with premium quality products, we source directly from local fishermen and sustainable farms.
              </Typography>
              <Typography variant="body1" paragraph>
                Our team of experts carefully selects each product, ensuring that only the best makes it to your door. We are committed to sustainability and supporting local communities.
              </Typography>
              <Button
                component={RouterLink}
                to="/about"
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 