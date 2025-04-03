import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Rating,
  useTheme,
  alpha,
  Link,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { MagneticElement } from './AwwwardsEffects';

export interface Product {
  _id: string;
  name: string;
  description: string;
  richDescription?: string;
  image: string;
  images?: string[];
  brand?: string;
  price: number;
  category: {
    _id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  dateCreated?: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onAddToCart,
  variant = 'default',
  isLoading = false
}) => {
  const theme = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isOutOfStock = product.countInStock <= 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;
    
    setIsAddingToCart(true);
    onAddToCart(product);
    
    // Reset loading after a brief period
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 800);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.05 * (i % 8), // reset delay after 8 items
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1]
      }
    })
  };

  // Calculate discount price (just for demo - normally would come from backend)
  const hasDiscount = product.isBestSeller;
  const discountPrice = hasDiscount ? product.price * 0.9 : null;
  
  // Generate badge based on product attributes
  const getBadge = () => {
    if (product.isNew) {
      return { label: 'New', color: 'secondary' };
    }
    if (product.isBestSeller) {
      return { label: 'Best Seller', color: 'primary' };
    }
    if (isOutOfStock) {
      return { label: 'Out of Stock', color: 'default' };
    }
    return null;
  };
  
  const badge = getBadge();
  
  // Compact variant for smaller grids
  if (variant === 'compact') {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={cardVariants}
      >
        <Card
          component={RouterLink}
          to={`/product/${product._id}`}
          className="card-hover"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease',
          }}
        >
          <Box className="image-zoom-container" sx={{ pt: '100%', position: 'relative' }}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              className="image-zoom"
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {badge && (
              <Chip
                label={badge.label}
                color={badge.color as any}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>
          
          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
              noWrap
            >
              {product.category.name}
            </Typography>
            
            <Typography
              gutterBottom
              variant="body1"
              component="h2"
              fontWeight={600}
              sx={{ mt: 0.5, mb: 1 }}
              noWrap
            >
              {product.name}
            </Typography>
            
            <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
              {hasDiscount ? (
                <>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    color="primary.main"
                  >
                    ${discountPrice?.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1, textDecoration: 'line-through' }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="body1"
                  fontWeight={700}
                  color="primary.main"
                >
                  ${product.price.toFixed(2)}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Featured variant with larger image and more details
  if (variant === 'featured') {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={cardVariants}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease',
          }}
          className="card-hover"
        >
          <Box sx={{ position: 'relative' }}>
            <CardActionArea component={RouterLink} to={`/product/${product._id}`}>
              <Box className="image-zoom-container" sx={{ pt: '80%', position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  className="image-zoom"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </CardActionArea>
            
            {badge && (
              <Chip
                label={badge.label}
                color={badge.color as any}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
            )}
            
            <IconButton
              aria-label="add to favorites"
              onClick={handleFavoriteToggle}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'background.paper',
                color: isFavorite ? 'error.main' : 'text.secondary',
                '&:hover': {
                  bgcolor: 'background.paper',
                  color: 'error.main',
                },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          
          <CardContent sx={{ pt: 3, pb: 0, px: 3, flexGrow: 1 }}>
            <Link
              component={RouterLink}
              to={`/product/${product._id}`}
              underline="hover"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
                sx={{ mb: 0.5 }}
              >
                {product.category.name}
              </Typography>
              
              <Typography
                gutterBottom
                variant="h6"
                component="h2"
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                {product.name}
              </Typography>
            </Link>
            
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Rating
                value={product.rating}
                precision={0.5}
                size="small"
                readOnly
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.numReviews})
              </Typography>
            </Box>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                mb: 2,
                height: 40,
              }}
            >
              {product.description}
            </Typography>
            
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ my: 1.5 }}>
              {product.countInStock > 0 ? (
                <Box display="flex" alignItems="center">
                  <LocalShippingIcon
                    fontSize="small"
                    sx={{ color: 'success.main', mr: 0.5 }}
                  />
                  <Typography variant="body2" color="success.main">
                    In Stock
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Out of stock
                </Typography>
              )}
              
              {hasDiscount ? (
                <Box textAlign="right">
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.main"
                  >
                    ${discountPrice?.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="primary.main"
                >
                  ${product.price.toFixed(2)}
                </Typography>
              )}
            </Box>
          </CardContent>
          
          <CardActions sx={{ p: 3, pt: 0 }}>
            <MagneticElement>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={isAddingToCart ? null : <ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={isAddingToCart || isOutOfStock}
                sx={{
                  py: 1,
                  borderRadius: 25,
                }}
              >
                {isAddingToCart ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isOutOfStock ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </MagneticElement>
          </CardActions>
        </Card>
      </motion.div>
    );
  }
  
  // Horizontal variant for cart or wishlist pages
  if (variant === 'horizontal') {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={cardVariants}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: 200 },
              position: 'relative'
            }}
          >
            <CardActionArea component={RouterLink} to={`/product/${product._id}`}>
              <Box className="image-zoom-container" sx={{ pt: { xs: '60%', sm: '100%' }, position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  className="image-zoom"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </CardActionArea>
            
            {badge && (
              <Chip
                label={badge.label}
                color={badge.color as any}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}>
            <CardContent sx={{ flex: '1 0 auto', p: 0, pb: 1 }}>
              <Link
                component={RouterLink}
                to={`/product/${product._id}`}
                underline="hover"
                color="inherit"
                sx={{ textDecoration: 'none' }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {product.category.name}
                </Typography>
                
                <Typography variant="h6" component="h2" sx={{ mt: 0.5 }}>
                  {product.name}
                </Typography>
              </Link>
              
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <Rating
                  value={product.rating}
                  precision={0.5}
                  size="small"
                  readOnly
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.numReviews})
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: { xs: 'none', md: '-webkit-box' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.description}
              </Typography>
            </CardContent>
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 'auto',
              }}
            >
              <Box>
                {hasDiscount ? (
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="primary.main"
                    >
                      ${discountPrice?.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.main"
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}>
                  <IconButton
                    onClick={handleFavoriteToggle}
                    color={isFavorite ? "error" : "default"}
                    size="small"
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isOutOfStock}
                  startIcon={isAddingToCart ? null : <ShoppingCartIcon />}
                  sx={{
                    borderRadius: 25,
                    px: 2,
                  }}
                >
                  {isAddingToCart ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : isOutOfStock ? (
                    "Out of Stock"
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </motion.div>
    );
  }
  
  // Default variant
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
        }}
        className="card-hover"
      >
        <Box sx={{ position: 'relative' }}>
          <CardActionArea component={RouterLink} to={`/product/${product._id}`}>
            <Box className="image-zoom-container" sx={{ pt: '100%', position: 'relative' }}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                className="image-zoom"
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </CardActionArea>
          
          {badge && (
            <Chip
              label={badge.label}
              color={badge.color as any}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
          
          <IconButton
            aria-label="add to favorites"
            onClick={handleFavoriteToggle}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              color: isFavorite ? 'error.main' : 'text.secondary',
              '&:hover': {
                bgcolor: alpha(theme.palette.background.paper, 1),
                color: 'error.main',
              },
              width: 32,
              height: 32,
            }}
          >
            {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Box>
        
        <CardContent sx={{ pt: 2, pb: 1, px: 2, flexGrow: 1 }}>
          <Link
            component={RouterLink}
            to={`/product/${product._id}`}
            underline="hover"
            color="inherit"
            sx={{ textDecoration: 'none' }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
              noWrap
            >
              {product.category.name}
            </Typography>
            
            <Typography
              gutterBottom
              variant="body1"
              component="h2"
              fontWeight={600}
              sx={{ 
                mt: 0.5, 
                mb: 1, 
                minHeight: 48,
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              {product.name}
            </Typography>
          </Link>
          
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <Rating
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              ({product.numReviews})
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 'auto' }}>
            {hasDiscount ? (
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={700}
                  color="primary.main"
                >
                  ${discountPrice?.toFixed(2)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="body1"
                fontWeight={700}
                color="primary.main"
              >
                ${product.price.toFixed(2)}
              </Typography>
            )}
            
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={isAddingToCart || isOutOfStock}
              onClick={handleAddToCart}
              sx={{
                minWidth: 'auto',
                width: 36,
                height: 36,
                borderRadius: '50%',
                p: 0,
              }}
            >
              {isAddingToCart ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <ShoppingCartIcon fontSize="small" />
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard; 