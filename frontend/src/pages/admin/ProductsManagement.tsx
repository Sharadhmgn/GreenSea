import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Grid,
  CircularProgress,
  Tooltip,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Photo as PhotoIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import OrderService from '../../utils/OrderService';

// Types
interface Product {
  _id: string;
  name: string;
  description: string;
  richDescription?: string;
  image?: string;
  images?: string[];
  brand?: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured: boolean;
  dateCreated: string;
}

interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface FilterOptions {
  category: string;
  featured: string;
  inStock: string;
  priceMin: string;
  priceMax: string;
}

const initialFilterOptions: FilterOptions = {
  category: '',
  featured: '',
  inStock: '',
  priceMin: '',
  priceMax: ''
};

const ProductsManagement = () => {
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(initialFilterOptions);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Build query parameters for filtering
        const queryParams: any = {};
        
        if (filterOptions.category) {
          queryParams.categories = filterOptions.category;
        }
        
        if (filterOptions.featured) {
          queryParams.featured = filterOptions.featured === 'true';
        }
        
        if (searchQuery) {
          queryParams.search = searchQuery;
        }
        
        // Fetch categories from API
        const categoriesResponse = await api.get('/categories');
        
        // Fetch products from API with filters
        const productsResponse = await api.get('/products', { params: queryParams });
        
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
        setTotalProducts(productsResponse.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [page, rowsPerPage, searchQuery, filterOptions]);
  
  // Filter methods
  const applyFilters = () => {
    // In a real app, this would trigger a new API request with the filter params
    console.log('Applying filters:', filterOptions);
    // For now, we'll just reset the page
    setPage(0);
  };
  
  const resetFilters = () => {
    setFilterOptions(initialFilterOptions);
    setPage(0);
  };
  
  // Handle Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    // Search functionality would be implemented here in a real app
  };
  
  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filter change handlers
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };
  
  // Delete handlers
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    
    setDeleteInProgress(true);
    
    try {
      // Make API call to delete the product
      await api.delete(`/products/${selectedProduct._id}`);
      
      // Update local state
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setTotalProducts(prev => prev - 1);
      
      // Show success message
      setSuccessMessage(`${selectedProduct.name} has been deleted successfully.`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Close dialog
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    } finally {
      setDeleteInProgress(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Add a function to handle Excel export
  const handleExportToExcel = () => {
    try {
      OrderService.exportProductsToExcel(products);
      setSuccessMessage('Products exported to Excel successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error exporting products:', error);
      setError('Failed to export products. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Products Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToExcel}
              sx={{ borderRadius: 2 }}
            >
              Export to Excel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/admin/products/new"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Add New Product
            </Button>
          </Box>
        </Box>
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Search Bar */}
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ flexGrow: 1, maxWidth: 500 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => setSearchQuery('')}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Filter Toggle Button */}
            <Button
              color="secondary"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ ml: 2, textTransform: 'none' }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Box>
          
          {/* Filters */}
          {showFilters && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    name="category"
                    label="Category"
                    value={filterOptions.category}
                    onChange={handleFilterChange}
                    size="small"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    name="featured"
                    label="Featured Status"
                    value={filterOptions.featured}
                    onChange={handleFilterChange}
                    size="small"
                  >
                    <MenuItem value="">All Products</MenuItem>
                    <MenuItem value="true">Featured Only</MenuItem>
                    <MenuItem value="false">Non-Featured Only</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    name="inStock"
                    label="Stock Status"
                    value={filterOptions.inStock}
                    onChange={handleFilterChange}
                    size="small"
                  >
                    <MenuItem value="">All Stock Status</MenuItem>
                    <MenuItem value="true">In Stock</MenuItem>
                    <MenuItem value="false">Out of Stock</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={6} sm={3} md={1.5}>
                  <TextField
                    fullWidth
                    name="priceMin"
                    label="Min Price"
                    type="number"
                    value={filterOptions.priceMin}
                    onChange={handleFilterChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={6} sm={3} md={1.5}>
                  <TextField
                    fullWidth
                    name="priceMax"
                    label="Max Price"
                    type="number"
                    value={filterOptions.priceMax}
                    onChange={handleFilterChange}
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={resetFilters}
                  startIcon={<ClearIcon />}
                  sx={{ mr: 1, textTransform: 'none' }}
                >
                  Reset
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={applyFilters}
                  startIcon={<FilterIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Apply Filters
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
        
        {/* Products Table */}
        <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'background.paper' } }}>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="center">Featured</TableCell>
                  <TableCell align="center">Date Added</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow 
                      key={product._id}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                        '& td': { py: 1.5 }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: 1, 
                              bgcolor: 'grey.200',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              mr: 2
                            }}
                          >
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                              />
                            ) : (
                              <PhotoIcon sx={{ color: 'grey.400' }} />
                            )}
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {product.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.category.name} 
                          size="small" 
                          sx={{ 
                            bgcolor: (
                              product.category.name === 'Fresh Fish' ? 'rgba(26, 95, 122, 0.1)' : 
                              product.category.name === 'Shellfish' ? 'rgba(255, 138, 0, 0.1)' :
                              product.category.name === 'Organic Vegetables' ? 'rgba(46, 125, 50, 0.1)' :
                              'rgba(156, 39, 176, 0.1)'
                            ),
                            color: (
                              product.category.name === 'Fresh Fish' ? 'secondary.main' : 
                              product.category.name === 'Shellfish' ? 'warning.main' :
                              product.category.name === 'Organic Vegetables' ? 'primary.main' :
                              'purple'
                            ),
                            borderRadius: 1
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatCurrency(product.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500, 
                            color: product.countInStock > 0 ? 'success.main' : 'error.main' 
                          }}
                        >
                          {product.countInStock > 0 ? product.countInStock : 'Out of stock'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {product.isFeatured ? (
                          <CheckIcon sx={{ color: 'success.main' }} />
                        ) : (
                          <CloseIcon sx={{ color: 'text.disabled' }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(product.dateCreated)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="View">
                            <IconButton 
                              size="small" 
                              color="info"
                              component={RouterLink}
                              to={`/admin/products/${product._id}/view`}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary"
                              component={RouterLink}
                              to={`/admin/products/${product._id}/edit`}
                              sx={{ ml: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteClick(product)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No products found. Try adjusting your filters or add a new product.
                      </Typography>
                      <Button
                        component={RouterLink}
                        to="/admin/products/new"
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ mt: 2 }}
                      >
                        Add New Product
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalProducts}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            color="inherit"
            disabled={deleteInProgress}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteInProgress}
            startIcon={deleteInProgress && <CircularProgress size={20} color="inherit" />}
          >
            {deleteInProgress ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductsManagement; 