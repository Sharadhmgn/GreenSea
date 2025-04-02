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
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AddShoppingCart as AddToCartIcon } from '@mui/icons-material';
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Best Sellers
        </Typography>
        <Grid container spacing={4}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton height={30} width="80%" />
                  <Skeleton height={20} width="50%" />
                  <Skeleton height={40} width="30%" />
                </CardContent>
                <CardActions>
                  <Skeleton height={40} width="100%" />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      {/* Page Heading */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Our Best Sellers
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Discover our most popular high-quality products, loved by customers
        </Typography>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    zIndex: 1 
                  }}
                >
                  <Chip 
                    label="Best Seller" 
                    color="warning" 
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      bgcolor: 'warning.main',
                      color: 'white'
                    }}
                  />
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  component={RouterLink} 
                  to={`/product/${product._id}`} 
                  sx={{ 
                    color: 'primary.main', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {product.name}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    my: 1 
                  }}
                >
                  <Rating 
                    value={product.rating || 0} 
                    precision={0.1} 
                    readOnly 
                    size="small" 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ ml: 1 }}
                    color="text.secondary"
                  >
                    ({product.numReviews})
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2 }}
                >
                  {product.description.length > 80 
                    ? `${product.description.substring(0, 80)}...` 
                    : product.description}
                </Typography>
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'primary.main'
                  }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<AddToCartIcon />}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.countInStock === 0}
                  sx={{ 
                    borderRadius: 8,
                    py: 1,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                    }
                  }}
                >
                  {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BestSellersPage; 