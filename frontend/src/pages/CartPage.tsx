import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  TextField,
  Divider,
  Breadcrumbs,
  Link,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import OrderService from '../utils/OrderService';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, error: cartError, total, itemCount } = useCart();
  const { isAuthenticated, user } = useAuth() || { isAuthenticated: false, user: null };
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const theme = useTheme();

  const handleUpdateQuantity = (id: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    updateQuantity(id, newQty);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const calculateSubtotal = () => {
    return cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  };

  const calculateShipping = (subtotal: number) => {
    // Free shipping over $100, otherwise $10 shipping fee
    return subtotal > 100 ? 0 : 10;
  };

  const calculateTax = (subtotal: number) => {
    // 8% sales tax
    return subtotal * 0.08;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    return subtotal + shipping + tax;
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to checkout');
      setTimeout(() => setError(null), 5000);
      return;
    }
    setCheckoutDialogOpen(true);
  };

  const confirmCheckout = async () => {
    try {
      setIsCheckingOut(true);
      setCheckoutDialogOpen(false);
      
      // Create mock shipping address (in a real app, you'd collect this from the user)
      const shippingAddress = {
        street: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA'
      };
      
      // Create the order
      const order = await OrderService.createOrder(
        cart,
        calculateTotal(),
        shippingAddress,
        user?.id || 'guest',
        user?.name,
        user?.email
      );
      
      // Show success message
      setOrderNumber(order.orderNumber);
      setShowSuccessAlert(true);
      
      // Clear the cart
      clearCart();
      
      // Reset checkout state
      setIsCheckingOut(false);
    } catch (error) {
      console.error('Error during checkout:', error);
      setIsCheckingOut(false);
      setError('Error processing your order. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

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
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <CartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Shopping Cart
          </Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Your Cart
        </Typography>

        {(error || cartError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || cartError}
          </Alert>
        )}

        {!cart || cart.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button
              component={RouterLink}
              to="/shop"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <List disablePadding>
                  {cart.map((item, index) => (
                    <Box key={item.id}>
                      <ListItem sx={{ py: 3, px: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={3} sm={2}>
                            <CardMedia
                              component="img"
                              sx={{ borderRadius: 1, height: 80, objectFit: 'cover' }}
                              image={item.image}
                              alt={item.name}
                            />
                          </Grid>
                          <Grid item xs={9} sm={4}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${item.price.toFixed(2)} each
                            </Typography>
                          </Grid>
                          <Grid item xs={7} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <TextField
                                size="small"
                                value={item.quantity}
                                InputProps={{
                                  readOnly: true,
                                  inputProps: {
                                    style: { textAlign: 'center', width: '40px' },
                                  },
                                }}
                                variant="outlined"
                                sx={{ mx: 1 }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                disabled={item.quantity >= item.countInStock}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={5}
                            sm={2}
                            sx={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <Typography variant="subtitle1" fontWeight="medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveItem(item.id)}
                              sx={{ color: 'error.main' }}
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {index < cart.length - 1 && <Divider variant="middle" />}
                    </Box>
                  ))}
                </List>
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/shop"
                    startIcon={<CartIcon />}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => clearCart()}
                    sx={{ ml: 2 }}
                    startIcon={<DeleteIcon />}
                  >
                    Clear Cart
                  </Button>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography variant="body1">Subtotal</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body1" align="right">
                          ${calculateSubtotal().toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body1">Shipping</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body1" align="right">
                          ${calculateShipping(calculateSubtotal()).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body1">Tax</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body1" align="right">
                          ${calculateTax(calculateSubtotal()).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography variant="h6">Total</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="right">
                        ${calculateTotal().toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={cart.length === 0 || isCheckingOut}
                    onClick={handleCheckout}
                    startIcon={isCheckingOut ? <CircularProgress size={24} color="inherit" /> : null}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1rem',
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    }}
                  >
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                  {!isAuthenticated && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      Please sign in to checkout
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
      <Snackbar 
        open={showSuccessAlert} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessAlert(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Order #{orderNumber} placed successfully!
        </Alert>
      </Snackbar>
      <Dialog
        open={checkoutDialogOpen}
        onClose={() => setCheckoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to place this order for ${calculateTotal().toFixed(2)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmCheckout} color="primary" variant="contained" autoFocus>
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage; 