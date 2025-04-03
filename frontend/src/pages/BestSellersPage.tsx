import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button,
  Rating, 
  Chip,
  Skeleton,
  CircularProgress,
  useTheme,
  alpha,
  Divider,
  Link,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AddShoppingCart as AddToCartIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Favorite as FavoriteIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

// Product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  image: string;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
}

const BestSellersPage = () => {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart() || { addToCart: () => {} };

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch best sellers from the API
        // For this demo, we'll use a mock list of top-rated products
        const response = await api.get('/products?featured=true');
        const featuredProducts = response.data;
        
        // Sort by rating (highest first)
        const sortedProducts = featuredProducts.sort((a: Product, b: Product) => {
          return (b.rating || 0) - (a.rating || 0);
        });
        
        setProducts(sortedProducts.slice(0, 8)); // Get top 8 products
        setLoading(false);
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setError('Failed to load best sellers. Please try again later.');
        setLoading(false);
        
        // In case the API fails, use mock data
        const mockProducts: Product[] = [
          {
            _id: '1',
            name: 'Fresh Atlantic Salmon',
            description: 'Premium quality Atlantic salmon, perfect for grilling or pan-searing.',
            price: 19.99,
            category: { _id: '1', name: 'Seafood' },
            image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            countInStock: 15,
            rating: 4.8,
            numReviews: 24,
            isFeatured: true
          },
          {
            _id: '2',
            name: 'Organic Broccoli',
            description: 'Fresh, organic broccoli crowns, rich in vitamins and minerals.',
            price: 3.49,
            category: { _id: '2', name: 'Vegetables' },
            image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            countInStock: 50,
            rating: 4.7,
            numReviews: 18,
            isFeatured: true
          },
          {
            _id: '3',
            name: 'Fresh Tiger Prawns',
            description: 'Large, succulent tiger prawns, perfect for grilling or seafood dishes.',
            price: 24.99,
            category: { _id: '1', name: 'Seafood' },
            image: 'https://images.unsplash.com/photo-1579164510289-e7196da8d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            countInStock: 20,
            rating: 4.9,
            numReviews: 32,
            isFeatured: true
          },
          {
            _id: '4',
            name: 'Organic Baby Spinach',
            description: 'Tender baby spinach leaves, perfect for salads and smoothies.',
            price: 4.99,
            category: { _id: '2', name: 'Vegetables' },
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            countInStock: 45,
            rating: 4.6,
            numReviews: 15,
            isFeatured: true
          },
          {
            _id: '5',
            name: 'Wild-Caught Tuna Steaks',
            description: 'Premium wild-caught tuna steaks, perfect for grilling or sushi.',
            price: 29.99,
            category: { _id: '1', name: 'Seafood' },
            image: 'https://images.unsplash.com/photo-1560717845-968823efbee1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            countInStock: 10,
            rating: 4.9,
            numReviews: 28,
            isFeatured: true
          },
          {
            _id: '6',
            name: 'Fresh Asparagus Bundle',
            description: 'Crisp, fresh asparagus spears, perfect for roasting or steaming.',
            price: 5.99,
            category: { _id: '2', name: 'Vegetables' },
            image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            countInStock: 30,
            rating: 4.7,
            numReviews: 22,
            isFeatured: true
          },
          {
            _id: '7',
            name: 'King Crab Legs',
            description: 'Succulent king crab legs, ready to steam and serve with butter.',
            price: 39.99,
            category: { _id: '1', name: 'Seafood' },
            image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            countInStock: 8,
            rating: 4.8,
            numReviews: 19,
            isFeatured: true
          },
          {
            _id: '8',
            name: 'Organic Kale Bunch',
            description: 'Nutrient-rich organic kale, perfect for salads, smoothies, and more.',
            price: 3.99,
            category: { _id: '2', name: 'Vegetables' },
            image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            countInStock: 40,
            rating: 4.5,
            numReviews: 17,
            isFeatured: true
          }
        ];
        
        setProducts(mockProducts);
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await api.post('/cart/add', {
        productId: product._id,
        quantity: 1
      });
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity: 1
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again later.');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 10, md: 16 },
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          mb: { xs: 8, md: 12 },
          overflow: 'hidden',
        }}
      >
        {/* Decorative shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: -100, md: -120 },
            right: { xs: -100, md: -50 },
            width: { xs: 250, md: 350 },
            height: { xs: 250, md: 350 },
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: -80, md: -120 },
            left: { xs: -100, md: -50 },
            width: { xs: 200, md: 300 },
            height: { xs: 200, md: 300 },
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)}, ${alpha(theme.palette.secondary.light, 0.1)})`,
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="overline"
                sx={{
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  color: theme.palette.primary.main,
                  mb: 2,
                  display: 'block',
                }}
              >
                CUSTOMER FAVORITES
              </Typography>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Best Sellers
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 4,
                  maxWidth: 650,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Discover our most popular products loved by customers. Premium quality, exceptional taste, and sustainably sourced.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 2, md: 4 },
                  mt: 4,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                  <Typography variant="subtitle2">Top Rated</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShippingIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="subtitle2">Fast Delivery</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FavoriteIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                  <Typography variant="subtitle2">Customer Favorites</Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ my: 8, textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : error ? (
          <Box sx={{ my: 8, textAlign: 'center', p: 4 }}>
            <Typography 
              variant="h5" 
              color="error" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1">{error}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, borderRadius: 2 }}
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Box>
        ) : (
          <Box sx={{ mb: 10 }}>
            <Grid container spacing={4}>
              {products.map((product, index) => (
                <Grid item key={product._id} xs={12} sm={6} md={3}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                          '& .product-image': {
                            transform: 'scale(1.08)',
                          },
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height={220}
                          image={product.image}
                          alt={product.name}
                          className="product-image"
                          sx={{
                            transition: 'transform 0.8s cubic-bezier(0.25, 0.45, 0.45, 0.95)',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            display: 'flex',
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={product.category.name}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              bgcolor: alpha(theme.palette.background.paper, 0.9),
                              backdropFilter: 'blur(8px)',
                              color: theme.palette.text.secondary,
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            }}
                          />
                        </Box>
                        {index < 3 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: theme.palette.primary.main,
                              color: 'white',
                              fontWeight: 'bold',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                              border: '2px solid white',
                            }}
                          >
                            #{index + 1}
                          </Box>
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Link
                            component={RouterLink}
                            to={`/product/${product._id}`}
                            underline="none"
                            sx={{ width: '85%' }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                transition: 'color 0.2s',
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {product.name}
                            </Typography>
                          </Link>
                          <IconButton 
                            size="small" 
                            aria-label="add to wishlist"
                            sx={{ 
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main' },
                            }}
                          >
                            <FavoriteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating
                            value={product.rating || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            icon={<StarIcon fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
                          />
                          <Typography
                            variant="body2"
                            sx={{ ml: 1, color: 'text.secondary', fontSize: '0.75rem' }}
                          >
                            ({product.numReviews || 0} reviews)
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.5,
                            height: '3em',
                          }}
                        >
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: 'primary.main' }}
                          >
                            ${product.price.toFixed(2)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: product.countInStock > 0 ? 'success.main' : 'error.main',
                              fontWeight: 500,
                            }}
                          >
                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Typography>
                        </Box>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ p: 2 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={product.countInStock === 0}
                          onClick={() => handleAddToCart(product)}
                          startIcon={<AddToCartIcon />}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            boxShadow: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* View all products link */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Button
                component={RouterLink}
                to="/shop"
                variant="outlined"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 50,
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                View All Products
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BestSellersPage; 