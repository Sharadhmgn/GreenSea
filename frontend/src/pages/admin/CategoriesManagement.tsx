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
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
  InputAdornment,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  ColorLens as ColorLensIcon,
  Check as CheckIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import api from '../../utils/api';
import OrderService from '../../utils/OrderService';

// Types
interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

interface FormData {
  _id?: string;
  name: string;
  icon: string;
  color: string;
}

const initialFormData: FormData = {
  name: '',
  icon: 'category',
  color: '#2e7d32' // Default to primary green
};

const CategoriesManagement = () => {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Common icons for seafood/grocery categories
  const commonIcons = [
    { name: 'category', label: 'Category (Default)' },
    { name: 'set_meal', label: 'Seafood' },
    { name: 'restaurant', label: 'Food' },
    { name: 'eco', label: 'Organic' },
    { name: 'grass', label: 'Vegetables' },
    { name: 'spa', label: 'Fresh' },
    { name: 'water', label: 'Water' },
    { name: 'savings', label: 'Fish' },
    { name: 'egg', label: 'Egg/Dairy' },
    { name: 'bakery_dining', label: 'Bakery' },
    { name: 'restaurant_menu', label: 'Menu/Prepared' },
    { name: 'local_shipping', label: 'Shipping' },
    { name: 'kitchen', label: 'Kitchen' },
    { name: 'shopping_basket', label: 'Basket' },
    { name: 'shopping_cart', label: 'Cart' }
  ];
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // In a real application, you would fetch this data from your API
        // For now, we'll use placeholder data
        
        // Mock API call for categories
        // const response = await api.get('/categories');
        const categoriesData: Category[] = [
          { _id: '1', name: 'Fresh Fish', icon: 'savings', color: '#1a5f7a' },
          { _id: '2', name: 'Shellfish', icon: 'set_meal', color: '#ff8a00' },
          { _id: '3', name: 'Organic Vegetables', icon: 'eco', color: '#2e7d32' },
          { _id: '4', name: 'Prepared Meals', icon: 'restaurant', color: '#9c27b0' }
        ];
        
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Open dialog for create
  const handleAddClick = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
    setDialogOpen(true);
  };
  
  // Open dialog for edit
  const handleEditClick = (category: Category) => {
    setFormData({
      _id: category._id,
      name: category.name,
      icon: category.icon,
      color: category.color
    });
    setIsEditMode(true);
    setDialogOpen(true);
  };
  
  // Open delete dialog
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle color change
  const handleColorChange = (color: any) => {
    setFormData(prev => ({ ...prev, color: color.hex }));
  };
  
  // Icon selection
  const handleIconClick = (icon: string) => {
    setFormData(prev => ({ ...prev, icon }));
  };
  
  // Submit form
  const handleSubmit = async () => {
    if (!formData.name) {
      setAlertMessage('Category name is required');
      setAlertSeverity('error');
      return;
    }
    
    setSubmitting(true);
    setAlertMessage('');
    
    try {
      if (isEditMode && formData._id) {
        // Update existing category
        // await api.put(`/categories/${formData._id}`, formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setCategories(categories.map(cat => 
          cat._id === formData._id ? { ...formData, _id: cat._id } as Category : cat
        ));
        
        setAlertMessage(`Category "${formData.name}" updated successfully!`);
      } else {
        // Create new category
        // const response = await api.post('/categories', formData);
        
        // Simulate API call and response
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockId = `new-${Date.now()}`;
        
        // Add to local state
        setCategories([...categories, { ...formData, _id: mockId } as Category]);
        
        setAlertMessage(`Category "${formData.name}" created successfully!`);
      }
      
      setAlertSeverity('success');
      setDialogOpen(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error saving category:', error);
      setAlertMessage('Failed to save category. Please try again.');
      setAlertSeverity('error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    setDeleteInProgress(true);
    
    try {
      // In a real app, this would make an API call
      // await api.delete(`/categories/${categoryToDelete._id}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setCategories(categories.filter(cat => cat._id !== categoryToDelete._id));
      
      // Show success message
      setAlertMessage(`Category "${categoryToDelete.name}" has been deleted successfully.`);
      setAlertSeverity('success');
      
      // Close dialog
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlertMessage('Failed to delete category. Please try again.');
      setAlertSeverity('error');
    } finally {
      setDeleteInProgress(false);
    }
  };
  
  // Add a function to handle Excel export
  const handleExportToExcel = () => {
    try {
      OrderService.exportCategoriesToExcel(categories);
      setSuccessMessage('Categories exported to Excel successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error exporting categories:', error);
      setError('Failed to export categories. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };
  
  // Check if handleAddCategory function exists, otherwise add it
  const handleAddCategory = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
    setDialogOpen(true);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Categories Management
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
              onClick={handleAddCategory}
              sx={{ borderRadius: 2 }}
            >
              Add Category
            </Button>
          </Box>
        </Box>
        
        {alertMessage && (
          <Alert severity={alertSeverity} sx={{ mb: 3 }} onClose={() => setAlertMessage('')}>
            {alertMessage}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'background.paper' } }}>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow 
                      key={category._id}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                        '& td': { py: 2 }
                      }}
                    >
                      <TableCell>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: category.color + '15', // 15% opacity 
                            color: category.color,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <span className="material-icons">
                            {category.icon}
                          </span>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: 1, 
                              bgcolor: category.color,
                              mr: 1
                            }} 
                          />
                          <Typography variant="body2">
                            {category.color}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEditClick(category)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteClick(category)}
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
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No categories found. Add a new category to get started.
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddCategory}
                        sx={{ mt: 2 }}
                      >
                        Add Category
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      
      {/* Add/Edit Category Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Category Name"
                type="text"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Category Icon
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {commonIcons.map((iconOption) => (
                  <Tooltip title={iconOption.label} key={iconOption.name}>
                    <Chip
                      icon={
                        <span className="material-icons" style={{ fontSize: 20 }}>
                          {iconOption.name}
                        </span>
                      }
                      label={iconOption.name === formData.icon ? <CheckIcon fontSize="small" /> : null}
                      onClick={() => handleIconClick(iconOption.name)}
                      sx={{ 
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        '& .MuiChip-label': { p: 0 },
                        bgcolor: iconOption.name === formData.icon ? `${formData.color}33` : 'background.paper',
                        border: iconOption.name === formData.icon ? `2px solid ${formData.color}` : '2px solid #e0e0e0',
                        '&:hover': {
                          bgcolor: `${formData.color}15`
                        }
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Category Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: formData.color,
                    borderRadius: 1,
                    cursor: 'pointer',
                    mr: 2,
                    border: '2px solid #e0e0e0'
                  }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <TextField
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ColorLensIcon sx={{ color: formData.color }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              
              {showColorPicker && (
                <Box sx={{ position: 'relative', zIndex: 10 }}>
                  <Box 
                    sx={{ 
                      position: 'fixed', 
                      top: 0, 
                      right: 0, 
                      bottom: 0, 
                      left: 0
                    }} 
                    onClick={() => setShowColorPicker(false)} 
                  />
                  <Box sx={{ position: 'absolute' }}>
                    <ChromePicker
                      color={formData.color}
                      onChange={handleColorChange}
                      disableAlpha
                    />
                  </Box>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Preview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Box 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    bgcolor: formData.color + '15', // 15% opacity 
                    color: formData.color,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2
                  }}
                >
                  <span className="material-icons" style={{ fontSize: 24 }}>
                    {formData.icon}
                  </span>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {formData.name || 'Category Name'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            color="inherit"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            color="primary"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Delete Category
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category <strong>"{categoryToDelete?.name}"</strong>? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Warning: Deleting a category may affect products associated with it.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
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

export default CategoriesManagement; 