import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tooltip
} from '@mui/material';
import { 
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../utils/api';

// Types
interface ProductFormData {
  name: string;
  description: string;
  richDescription: string;
  image: File | string | null;
  images: (File | string)[];
  brand: string;
  price: string;
  category: string;
  countInStock: string;
  rating: string;
  numReviews: string;
  isFeatured: boolean;
}

interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  richDescription: '',
  image: null,
  images: [],
  brand: '',
  price: '',
  category: '',
  countInStock: '',
  rating: '',
  numReviews: '',
  isFeatured: false
};

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // State
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  
  // Fetch product data for edit mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories from API
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);
        
        if (isEditMode) {
          // Fetch product data if in edit mode
          const productResponse = await api.get(`/products/${id}`);
          const productData = productResponse.data;
          
          setFormData({
            name: productData.name,
            description: productData.description,
            richDescription: productData.richDescription || '',
            image: productData.image,
            images: productData.images || [],
            brand: productData.brand || '',
            price: productData.price.toString(),
            category: productData.category._id || productData.category,
            countInStock: productData.countInStock.toString(),
            rating: productData.rating ? productData.rating.toString() : '',
            numReviews: productData.numReviews ? productData.numReviews.toString() : '',
            isFeatured: productData.isFeatured
          });
          
          // Set image previews
          setMainImagePreview(typeof productData.image === 'string' ? productData.image : null);
          setAdditionalImagePreviews(
            productData.images
              .filter((img: any): img is string => typeof img === 'string')
          );
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlertMessage('Failed to load product data. Please try again.');
        setAlertSeverity('error');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle rich text editor changes
  const handleRichTextChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      richDescription: value
    }));
    
    // Clear error when field is edited
    if (errors.richDescription) {
      setErrors(prev => ({ ...prev, richDescription: '' }));
    }
  };
  
  // Handle switch changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };
  
  // Handle main image upload
  const onMainImageDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const preview = URL.createObjectURL(file);
      setMainImagePreview(preview);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  }, [errors.image]);
  
  const { getRootProps: getMainImageRootProps, getInputProps: getMainImageInputProps } = useDropzone({
    onDrop: onMainImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });
  
  // Handle additional images upload
  const onAdditionalImagesDrop = useCallback((acceptedFiles: File[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...acceptedFiles]
    }));
    
    // Create previews
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
  }, []);
  
  const { getRootProps: getAdditionalImagesRootProps, getInputProps: getAdditionalImagesInputProps } = useDropzone({
    onDrop: onAdditionalImagesDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });
  
  // Remove main image
  const handleRemoveMainImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setMainImagePreview(null);
  };
  
  // Remove additional image
  const handleRemoveAdditionalImage = (index: number) => {
    // Remove from form data
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Remove from previews
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.description) newErrors.description = 'Brief description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }
    
    // Stock validation
    if (!formData.countInStock) {
      newErrors.countInStock = 'Stock count is required';
    } else {
      const stock = parseInt(formData.countInStock);
      if (isNaN(stock) || stock < 0) {
        newErrors.countInStock = 'Stock must be a non-negative number';
      }
    }
    
    // Image validation for new products
    if (!isEditMode && !formData.image) {
      newErrors.image = 'Main product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSubmitting(true);
    setAlertMessage('');
    
    try {
      // Create FormData object to handle file uploads
      const productFormData = new FormData();
      
      // Add text fields
      productFormData.append('name', formData.name);
      productFormData.append('description', formData.description);
      productFormData.append('richDescription', formData.richDescription);
      productFormData.append('brand', formData.brand);
      productFormData.append('price', formData.price);
      productFormData.append('category', formData.category);
      productFormData.append('countInStock', formData.countInStock);
      productFormData.append('rating', formData.rating || '0');
      productFormData.append('numReviews', formData.numReviews || '0');
      productFormData.append('isFeatured', formData.isFeatured.toString());
      
      // Add main image file
      if (formData.image instanceof File) {
        productFormData.append('image', formData.image);
      }
      
      // For additional images (for gallery)
      formData.images.forEach(image => {
        if (image instanceof File) {
          productFormData.append('images', image);
        }
      });
      
      if (isEditMode) {
        // Update existing product
        await api.put(`/products/${id}`, productFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setAlertMessage('Product updated successfully!');
        setAlertSeverity('success');
      } else {
        // Create new product
        await api.post('/products', productFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setAlertMessage('Product created successfully!');
        setAlertSeverity('success');
        
        // Reset form after successful creation
        if (!isEditMode) {
          setFormData(initialFormData);
          setMainImagePreview(null);
          setAdditionalImagePreviews([]);
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setAlertMessage('Failed to save product. Please try again.');
      setAlertSeverity('error');
    } finally {
      setSubmitting(false);
      // Scroll to top to show alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            component={RouterLink}
            to="/admin/products"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back to Products
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Typography>
        </Box>
        
        {alertMessage && (
          <Alert 
            severity={alertSeverity} 
            sx={{ mb: 3 }}
            onClose={() => setAlertMessage('')}
          >
            {alertMessage}
          </Alert>
        )}
        
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="brand"
                  name="brand"
                  label="Brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  name="description"
                  label="Brief Description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Detailed Description
                </Typography>
                <Box 
                  sx={{ 
                    '.ql-editor': { minHeight: '200px' },
                    border: errors.richDescription ? '1px solid #d32f2f' : undefined,
                    borderRadius: 1
                  }}
                >
                  <ReactQuill 
                    theme="snow" 
                    value={formData.richDescription} 
                    onChange={handleRichTextChange} 
                  />
                </Box>
                {errors.richDescription && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {errors.richDescription}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              {/* Product Details */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                  Product Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  required
                  fullWidth
                  id="price"
                  name="price"
                  label="Price"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  required
                  fullWidth
                  id="countInStock"
                  name="countInStock"
                  label="Stock Quantity"
                  type="number"
                  value={formData.countInStock}
                  onChange={handleChange}
                  error={!!errors.countInStock}
                  helperText={errors.countInStock}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="rating"
                  name="rating"
                  label="Rating (0-5)"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0, max: 5, step: 0.1 }
                  }}
                  value={formData.rating}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="numReviews"
                  name="numReviews"
                  label="Number of Reviews"
                  type="number"
                  value={formData.numReviews}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  select
                  fullWidth
                  id="category"
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  error={!!errors.category}
                  helperText={errors.category}
                >
                  <MenuItem value="">Select a category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleSwitchChange}
                      name="isFeatured"
                      color="primary"
                    />
                  }
                  label="Featured Product"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              {/* Product Images */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                  Product Images
                </Typography>
              </Grid>
              
              {/* Main Product Image */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Main Product Image {!isEditMode && <span style={{ color: '#d32f2f' }}>*</span>}
                </Typography>
                
                {mainImagePreview ? (
                  <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                    <img 
                      src={mainImagePreview} 
                      alt="Product preview" 
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        display: 'block'
                      }} 
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                        }
                      }}
                      onClick={handleRemoveMainImage}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    {...getMainImageRootProps()}
                    sx={{
                      border: '2px dashed',
                      borderColor: errors.image ? 'error.main' : 'divider',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      mb: 2,
                      bgcolor: 'background.paper',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(0, 0, 0, 0.01)'
                      }
                    }}
                  >
                    <input {...getMainImageInputProps()} />
                    <AddPhotoIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body1">
                      Drag & drop main product image here, or click to select
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supported formats: JPG, PNG, WEBP (Max 5MB)
                    </Typography>
                  </Box>
                )}
                
                {errors.image && (
                  <Typography color="error" variant="caption">
                    {errors.image}
                  </Typography>
                )}
              </Grid>
              
              {/* Additional Product Images */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Additional Images (Optional)
                </Typography>
                
                <Box
                  {...getAdditionalImagesRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    mb: 2,
                    bgcolor: 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(0, 0, 0, 0.01)'
                    }
                  }}
                >
                  <input {...getAdditionalImagesInputProps()} />
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1">
                    Drag & drop additional images here, or click to select
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supported formats: JPG, PNG, WEBP (Max 5MB each)
                  </Typography>
                </Box>
                
                {additionalImagePreviews.length > 0 && (
                  <Grid container spacing={2}>
                    {additionalImagePreviews.map((preview, index) => (
                      <Grid item xs={4} key={index}>
                        <Card sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="100"
                            image={preview}
                            alt={`Additional image ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardActions sx={{ position: 'absolute', top: 0, right: 0, p: 0 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveAdditionalImage(index)}
                              sx={{
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                m: 0.5,
                                '&:hover': {
                                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                component={RouterLink}
                to="/admin/products"
                variant="outlined"
                color="inherit"
                sx={{ mr: 2 }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductForm; 