import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Rating,
  Skeleton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Pagination,
  Chip,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  alpha,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Sort as SortIcon,
  Add as AddIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useCart, Product } from '../context/CartContext';

const ShopPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [page, setPage] = useState(1);
  const productsPerPage = 8;
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        
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
        
        setProducts(products);
        setFilteredProducts(products);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(products.map((p: Product) => p.category))];
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on selected category and search query
    let result = [...products];
    
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description?.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    setFilteredProducts(result);
    setPage(1); // Reset to first page when filters change
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Calculate pagination
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const getProductsText = () => {
    if (filteredProducts.length === 0) return "No products found";
    if (filteredProducts.length === 1) return "1 product";
    return `${filteredProducts.length} products`;
  };

  return (
    <Box>
      {/* Hero Section - Fixed positioning issues */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '50vh', md: '50vh' }, // Increased height for mobile view
          display: 'flex',
          alignItems: 'center',
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          mb: { xs: 6, md: 10 },
          overflow: 'visible', // Changed from 'hidden' to prevent cutoff
          zIndex: 1, // Added z-index
          py: { xs: 6, md: 8 }, // Added padding top/bottom
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                style={{ width: '100%' }} // Added width 100%
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    letterSpacing: 2,
                    mb: 2,
                    display: 'block',
                    // Fixed visibility
                    visibility: 'visible',
                    opacity: 1,
                  }}
                >
                  EXPLORE OUR SELECTION
                </Typography>

                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Shop Quality Products
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    maxWidth: 500, 
                    mb: 4,
                    fontWeight: 400, 
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  Explore our selection of premium, sustainably-sourced seafood and vegetables, delivered fresh to businesses across Belgium.
                </Typography>

                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  sx={{ width: '100%', maxWidth: 450 }} // Ensured width is set explicitly
                >
                  <TextField
                    fullWidth
                    placeholder="Search for products..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                      width: '100%', // Explicit width
                      backgroundColor: 'white',
                      borderRadius: 2,
                      visibility: 'visible', // Ensured visibility
                      position: 'relative', // Ensured positioning
                      zIndex: 5, // Higher z-index
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setSearchQuery('')}
                            size="small"
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Decorative Elements - Fixed positioning to avoid content interference */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 0, md: 0 }, // Adjusted positioning
            bottom: { xs: 0, md: 0 },
            width: { xs: 200, md: 400 },
            height: { xs: 200, md: 400 },
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.05)})`,
            zIndex: 0, // Ensure it's behind content
            transform: 'translate(30%, 30%)', // Move partially off-screen
            pointerEvents: 'none', // Prevent interaction with the element
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 0, md: 100 },
            top: { xs: 0, md: 0 },
            width: { xs: 150, md: 300 },
            height: { xs: 150, md: 300 },
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.light, 0.05)})`,
            zIndex: 0, // Ensure it's behind content
            transform: 'translate(0, -30%)', // Move partially off-screen
            pointerEvents: 'none', // Prevent interaction with the element
          }}
        />
      </Box>

      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4, color: 'text.secondary' }}>
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Home
          </Link>
          <Typography color="text.primary" fontWeight={500}>Shop</Typography>
        </Breadcrumbs>

        {/* Filter Controls - Fixed layout */}
        <Box
          sx={{
            mb: 6,
            p: { xs: 2, md: 3 },
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                  sx={{
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      },
                    },
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortChange}
                  startAdornment={<SortIcon fontSize="small" sx={{ ml: 1, mr: 1, color: 'action.active' }} />}
                  sx={{
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      },
                    },
                  }}
                >
                  <MenuItem value="">Recommended</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="name-asc">Name: A to Z</MenuItem>
                  <MenuItem value="name-desc">Name: Z to A</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                >
                  {getProductsText()}
                </Typography>
                {(selectedCategory || searchQuery || sortBy) && (
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleClearFilters}
                    startIcon={<ClearIcon fontSize="small" />}
                    sx={{ ml: 2, textTransform: 'none', fontWeight: 500 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Product Grid */}
        <Box sx={{ minHeight: '50vh', mb: 6 }}>
          <AnimatePresence mode="wait">
            {loading ? (
              // Loading skeleton
              <Grid container spacing={4}>
                {Array.from(new Array(4)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                      }}
                    >
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton width="60%" height={30} />
                        <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                        <Skeleton width="90%" height={20} sx={{ mt: 2 }} />
                        <Skeleton width="90%" height={20} sx={{ mt: 1 }} />
                      </CardContent>
                      <CardActions>
                        <Skeleton width="100%" height={40} />
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : filteredProducts.length === 0 ? (
              // No results
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 10,
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <SearchIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    No products found
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}
                  >
                    We couldn't find any products matching your search criteria. Try adjusting your filters or search for something else.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClearFilters}
                    sx={{ borderRadius: 50, px: 3 }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </motion.div>
            ) : (
              // Product grid
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={4}>
                  {currentProducts.map((product, index) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card
                          elevation={0}
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                              '& .product-image': {
                                transform: 'scale(1.08)',
                              },
                            },
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={product.image}
                              alt={product.name}
                              className="product-image"
                              sx={{
                                transition: 'transform 0.8s cubic-bezier(0.25, 0.45, 0.45, 0.95)',
                              }}
                            />
                            {product.category && (
                              <Chip
                                label={product.category}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  left: 12,
                                  borderRadius: 1,
                                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                  backdropFilter: 'blur(8px)',
                                  fontSize: '0.7rem',
                                  color: theme.palette.text.secondary,
                                  fontWeight: 500,
                                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                }}
                              />
                            )}
                          </Box>
                          <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Box sx={{ mb: 1 }}>
                              <Typography
                                variant="h6"
                                component={RouterLink}
                                to={`/product/${product.id}`}
                                sx={{
                                  color: 'text.primary',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  transition: 'color 0.2s',
                                  '&:hover': {
                                    color: 'primary.main',
                                  },
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {product.name}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <Rating
                                value={product.rating || 0}
                                precision={0.1}
                                size="small"
                                readOnly
                                icon={<StarIcon fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  ml: 0.5,
                                  color: theme.palette.text.secondary,
                                  fontSize: '0.75rem',
                                }}
                              >
                                {product.rating?.toFixed(1) || "N/A"}
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
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="primary.main"
                              >
                                ${product.price?.toFixed(2)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color={product.countInStock > 0 ? 'success.main' : 'error.main'}
                                sx={{ fontWeight: 500 }}
                              >
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                              </Typography>
                            </Box>
                          </CardContent>
                          <Divider />
                          <CardActions sx={{ p: 2 }}>
                            <Button
                              fullWidth
                              size="large"
                              variant="contained"
                              color="primary"
                              startIcon={<AddIcon />}
                              onClick={() => handleAddToCart(product)}
                              disabled={product.countInStock === 0}
                              sx={{
                                borderRadius: 2,
                                py: 1.5,
                                fontWeight: 600,
                                boxShadow: 'none',
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
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 8,
              mb: 4,
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ShopPage;