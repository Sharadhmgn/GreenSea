import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  TextField,
  Rating,
  Chip,
  Skeleton,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  IconButton,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Reviews as ReviewsIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { styled } from '@mui/material/styles';

// Styled components
const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ThumbnailImage = styled('img')(({ theme }) => ({
  width: '70px',
  height: '70px',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '2px solid transparent',
  '&.active': {
    borderColor: theme.palette.primary.main,
    transform: 'scale(1.05)',
  },
  '&:hover': {
    borderColor: theme.palette.primary.light,
  },
}));

// Mock Product Interface
interface Product {
  _id: string;
  name: string;
  description: string;
  richDescription: string;
  image: string;
  images: string[];
  brand: string;
  price: number;
  category: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  dateCreated: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart() || { addToCart: () => {} };
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // In a real application, fetch from your API
        // const response = await fetch(`/api/products/${id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockProduct: Product = {
            _id: id || '1',
            name: 'Fresh Atlantic Salmon Fillet',
            description: 'Premium quality fresh Atlantic salmon, perfect for grilling or baking.',
            richDescription: `<p>Our premium Atlantic Salmon is sourced sustainably from the cold, clean waters of Norway. Each fillet is carefully cut and prepared to ensure the highest quality.</p>
                             <p>Atlantic salmon is not only delicious but also packed with nutrients:</p>
                             <ul>
                               <li>High in Omega-3 fatty acids</li>
                               <li>Excellent source of protein</li>
                               <li>Rich in vitamin B12 and D</li>
                               <li>Contains essential minerals</li>
                             </ul>
                             <p>Store in refrigerator at 0-4°C and consume within 2 days of purchase for optimal freshness.</p>`,
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
            images: [
              'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
              'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
              'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
            ],
            brand: 'Green Sea',
            price: 24.99,
            category: {
              _id: 'cat1',
              name: 'Fresh Fish',
              icon: 'savings',
              color: '#1a5f7a',
            },
            countInStock: 15,
            rating: 4.5,
            numReviews: 24,
            isFeatured: true,
            dateCreated: '2023-04-10T12:00:00Z',
          };
          
          setProduct(mockProduct);
          setActiveImage(mockProduct.image);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0 && product && value <= product.countInStock) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (product && quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product._id,
        quantity: quantity
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" width="100%" height={400} animation="wave" />
            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
              <Skeleton variant="rectangular" width={80} height={80} animation="wave" />
              <Skeleton variant="rectangular" width={80} height={80} animation="wave" />
              <Skeleton variant="rectangular" width={80} height={80} animation="wave" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="70%" height={40} animation="wave" />
            <Skeleton variant="text" width="40%" height={30} animation="wave" />
            <Skeleton variant="text" width="30%" height={30} animation="wave" />
            <Skeleton variant="text" width="90%" height={100} animation="wave" />
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={50} animation="wave" />
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Product not found.</Alert>
        <Button variant="outlined" onClick={() => navigate('/shop')} sx={{ mt: 2 }}>
          Back to Shop
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link color="inherit" href="/" underline="hover">Home</Link>
        <Link color="inherit" href="/shop" underline="hover">Shop</Link>
        <Link color="inherit" href={`/shop?category=${product.category._id}`} underline="hover">
          {product.category.name}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      {addedToCart && (
        <Alert 
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setAddedToCart(false)}
        >
          Product added to cart successfully!
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, overflow: 'hidden', mb: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {activeImage && (
              <ProductImage src={activeImage} alt={product.name} />
            )}
          </Paper>
          
          <Box sx={{ display: 'flex', gap: 2, overflow: 'auto', pb: 1 }}>
            {product.images.map((img, index) => (
              <Box key={index} onClick={() => setActiveImage(img)}>
                <ThumbnailImage 
                  src={img} 
                  alt={`${product.name} - image ${index + 1}`} 
                  className={activeImage === img ? 'active' : ''}
                />
              </Box>
            ))}
          </Box>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                ({product.numReviews} reviews)
              </Typography>
            </Box>
            
            <Chip 
              label={product.category.name} 
              size="small" 
              sx={{ 
                mb: 2, 
                bgcolor: `${product.category.color}15`, 
                color: product.category.color,
                '& .MuiChip-icon': { color: product.category.color }
              }}
              icon={<span className="material-icons" style={{ fontSize: 16 }}>{product.category.icon}</span>}
            />
            
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
              ${product.price.toFixed(2)}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              {product.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Stock Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Availability:</Typography>
              {product.countInStock > 0 ? (
                <Chip 
                  label={`In Stock (${product.countInStock} available)`} 
                  color="success" 
                  size="small" 
                  variant="outlined" 
                />
              ) : (
                <Chip label="Out of Stock" color="error" size="small" variant="outlined" />
              )}
            </Box>
            
            {/* Add to Cart Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1, 
                mr: 2 
              }}>
                <IconButton size="small" onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={handleQuantityChange}
                  type="number"
                  inputProps={{ min: 1, max: product.countInStock }}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    width: '60px',
                    '& .MuiOutlinedInput-root': { 
                      '& fieldset': { border: 'none' } 
                    },
                    '& input': { 
                      textAlign: 'center', 
                      py: '8px',
                      px: 0
                    }
                  }}
                />
                <IconButton 
                  size="small" 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.countInStock}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                sx={{ flexGrow: 1, py: 1.5 }}
              >
                Add to Cart
              </Button>
              
              <IconButton 
                color="primary" 
                sx={{ ml: 1, border: '1px solid', borderColor: 'divider' }}
                onClick={toggleFavorite}
                aria-label="add to favorites"
              >
                {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>
          </Box>
          
          {/* Tabs for additional content */}
          <Box sx={{ mt: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="product information tabs"
              variant="fullWidth"
            >
              <Tab icon={<DescriptionIcon />} label="Description" />
              <Tab icon={<InfoIcon />} label="Details" />
              <Tab icon={<ReviewsIcon />} label="Reviews" />
            </Tabs>
            
            {/* Description Tab */}
            <Box sx={{ p: 2, minHeight: '200px' }} hidden={tabValue !== 0}>
              <div dangerouslySetInnerHTML={{ __html: product.richDescription }} />
            </Box>
            
            {/* Details Tab */}
            <Box sx={{ p: 2, minHeight: '200px' }} hidden={tabValue !== 1}>
              <Typography variant="subtitle1" gutterBottom>Product Specifications</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Brand</Typography>
                  <Typography variant="body1">{product.brand}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{product.category.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">In Stock</Typography>
                  <Typography variant="body1">{product.countInStock} units</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Added Date</Typography>
                  <Typography variant="body1">
                    {new Date(product.dateCreated).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            {/* Reviews Tab */}
            <Box sx={{ p: 2, minHeight: '200px' }} hidden={tabValue !== 2}>
              <Typography variant="subtitle1" gutterBottom>
                Customer Reviews ({product.numReviews})
              </Typography>
              
              {/* Mock Reviews */}
              <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={5} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                    Excellent quality
                  </Typography>
                </Box>
                <Typography variant="body2">
                  The salmon was extremely fresh and the flavor was outstanding. Definitely will order again!
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                  John D. - 2 weeks ago
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={4} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                    Great product
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Very good quality salmon. The delivery was prompt and packaging was excellent.
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                  Sarah M. - 1 month ago
                </Typography>
              </Paper>
              
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 1 }}
              >
                Write a Review
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* Related Products */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          You May Also Like
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={`https://source.unsplash.com/featured/?seafood&${item}`}
                  alt={`Related product ${item}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="subtitle1" component="div" noWrap>
                    Related Seafood Product {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.category.name}
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                    ${(product.price * 0.8 + item * 2).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductPage; 