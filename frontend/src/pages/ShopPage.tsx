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
  Pagination,
  Chip,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { FilterList as FilterIcon, Home as HomeIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';

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

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortBy(event.target.value as string);
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

  return (
    <Box sx={{ pt: 2, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary">Shop</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Our Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore our selection of premium, sustainably-sourced seafood products
          </Typography>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Search Products"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={selectedCategory}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => handleCategoryChange(event as any)}
                  label="Category"
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
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-select-label">Sort By</InputLabel>
                <Select
                  labelId="sort-select-label"
                  value={sortBy}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => handleSortChange(event as any)}
                  label="Sort By"
                >
                  <MenuItem value="">Featured</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="name-asc">Name: A to Z</MenuItem>
                  <MenuItem value="name-desc">Name: Z to A</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearFilters}
                startIcon={<FilterIcon />}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>

          {/* Active filters */}
          {(selectedCategory || searchQuery || sortBy) && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedCategory && (
                <Chip
                  label={`Category: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  onDelete={() => setSearchQuery('')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              {sortBy && (
                <Chip
                  label={`Sort: ${
                    {
                      'price-asc': 'Price: Low to High',
                      'price-desc': 'Price: High to Low',
                      'name-asc': 'Name: A to Z',
                      'name-desc': 'Name: Z to A',
                      rating: 'Rating',
                    }[sortBy]
                  }`}
                  onDelete={() => setSortBy('')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>

        {/* Product Count */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </Typography>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(8)).map((_, index) => (
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
            : currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={3}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
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
                          <Typography variant="subtitle1" component="h2" fontWeight="medium" gutterBottom>
                            {product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={product.rating} precision={0.5} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {product.rating}
                            </Typography>
                          </Box>
                          <Chip
                            label={product.category}
                            size="small"
                            sx={{ mb: 1, bgcolor: 'primary.light', color: 'white' }}
                          />
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {product.description?.length > 100
                              ? `${product.description.substring(0, 100)}...`
                              : product.description}
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
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      py: 8,
                      textAlign: 'center',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      No products found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters or search criteria
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                </Grid>
              )}
        </Grid>

        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ShopPage; 