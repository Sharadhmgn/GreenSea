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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Card,
  CardContent,
  List,
  ListItem
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as ShippingIcon,
  CancelOutlined as CancelIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

// Types
interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  totalPrice: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    quantity: number;
    product: {
      _id: string;
      name: string;
      price: number;
      image?: string;
    };
  }[];
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  dateOrdered: string;
}

const OrdersManagement = () => {
  const navigate = useNavigate();
  
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [tabValue, setTabValue] = useState(0); // 0 = All, 1 = Pending, 2 = Processing, etc.
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // In a real application, you would fetch this data from your API
        // For now, we'll use placeholder data
        
        // Mock API call for orders
        // const ordersResponse = await api.get('/orders', { params: { status, search: searchQuery, page, limit: rowsPerPage } });
        const ordersData: Order[] = [
          {
            _id: '1',
            orderNumber: 'GSF-2023-001',
            user: {
              _id: 'u1',
              name: 'John Doe',
              email: 'john@example.com'
            },
            totalPrice: 129.95,
            shippingAddress: {
              street: '123 Main St',
              city: 'New York',
              postalCode: '10001',
              country: 'USA'
            },
            items: [
              {
                quantity: 2,
                product: {
                  _id: 'p1',
                  name: 'Fresh Atlantic Salmon',
                  price: 15.99,
                  image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'
                }
              },
              {
                quantity: 1,
                product: {
                  _id: 'p2',
                  name: 'Jumbo Shrimp',
                  price: 19.99,
                  image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6'
                }
              }
            ],
            status: 'Delivered',
            paymentStatus: 'Paid',
            dateOrdered: '2023-06-10T14:30:00Z'
          },
          {
            _id: '2',
            orderNumber: 'GSF-2023-002',
            user: {
              _id: 'u2',
              name: 'Jane Smith',
              email: 'jane@example.com'
            },
            totalPrice: 76.50,
            shippingAddress: {
              street: '456 Elm St',
              city: 'Los Angeles',
              postalCode: '90001',
              country: 'USA'
            },
            items: [
              {
                quantity: 3,
                product: {
                  _id: 'p3',
                  name: 'Organic Kale',
                  price: 3.99,
                  image: 'https://images.unsplash.com/photo-1576038761798-77b5ca810e2e'
                }
              },
              {
                quantity: 2,
                product: {
                  _id: 'p4',
                  name: 'Wild Cod Fillets',
                  price: 12.99,
                  image: 'https://images.unsplash.com/photo-1583227061267-8428fb76fb2d'
                }
              }
            ],
            status: 'Processing',
            paymentStatus: 'Paid',
            dateOrdered: '2023-06-12T09:15:00Z'
          },
          {
            _id: '3',
            orderNumber: 'GSF-2023-003',
            user: {
              _id: 'u3',
              name: 'Robert Johnson',
              email: 'robert@example.com'
            },
            totalPrice: 224.75,
            shippingAddress: {
              street: '789 Oak St',
              city: 'Chicago',
              postalCode: '60601',
              country: 'USA'
            },
            items: [
              {
                quantity: 1,
                product: {
                  _id: 'p5',
                  name: 'Seafood Paella Kit',
                  price: 29.99,
                  image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7'
                }
              }
            ],
            status: 'Shipped',
            paymentStatus: 'Paid',
            dateOrdered: '2023-06-11T16:45:00Z'
          },
          {
            _id: '4',
            orderNumber: 'GSF-2023-004',
            user: {
              _id: 'u4',
              name: 'Emily Davis',
              email: 'emily@example.com'
            },
            totalPrice: 95.20,
            shippingAddress: {
              street: '101 Pine St',
              city: 'Seattle',
              postalCode: '98101',
              country: 'USA'
            },
            items: [
              {
                quantity: 4,
                product: {
                  _id: 'p6',
                  name: 'Organic Bell Peppers',
                  price: 4.99,
                  image: 'https://images.unsplash.com/photo-1563199544-9cb8c83bd59a'
                }
              },
              {
                quantity: 2,
                product: {
                  _id: 'p1',
                  name: 'Fresh Atlantic Salmon',
                  price: 15.99,
                  image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'
                }
              }
            ],
            status: 'Pending',
            paymentStatus: 'Pending',
            dateOrdered: '2023-06-13T11:20:00Z'
          },
          {
            _id: '5',
            orderNumber: 'GSF-2023-005',
            user: {
              _id: 'u5',
              name: 'Michael Wilson',
              email: 'michael@example.com'
            },
            totalPrice: 156.80,
            shippingAddress: {
              street: '222 Maple St',
              city: 'Boston',
              postalCode: '02101',
              country: 'USA'
            },
            items: [
              {
                quantity: 1,
                product: {
                  _id: 'p7',
                  name: 'Wild Caught Tuna',
                  price: 22.99,
                  image: 'https://images.unsplash.com/photo-1602404421624-87725823896d'
                }
              },
              {
                quantity: 3,
                product: {
                  _id: 'p2',
                  name: 'Jumbo Shrimp',
                  price: 19.99,
                  image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6'
                }
              }
            ],
            status: 'Cancelled',
            paymentStatus: 'Failed',
            dateOrdered: '2023-06-13T13:10:00Z'
          }
        ];
        
        setOrders(ordersData);
        setTotalOrders(ordersData.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [page, rowsPerPage, searchQuery, tabValue]);
  
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
  
  // Tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };
  
  // Action menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };
  
  // View order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
    handleMenuClose();
  };
  
  // Update order status
  const handleUpdateStatus = async (newStatus: Order['status']) => {
    if (!selectedOrderId) return;
    
    try {
      // In a real app, this would make an API call
      // await api.put(`/orders/${selectedOrderId}/status`, { status: newStatus });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === selectedOrderId ? { ...order, status: newStatus } : order
      ));
      
      // Show success message
      setSuccessMessage(`Order ${orders.find(o => o._id === selectedOrderId)?.orderNumber} status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
      handleMenuClose();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
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
  
  // Get status color
  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'Delivered':
        return '#43a047'; // green
      case 'Shipped':
        return '#1a5f7a'; // blue
      case 'Processing':
        return '#ff8a00'; // orange
      case 'Pending':
        return '#757575'; // grey
      case 'Cancelled':
        return '#e53935'; // red
      default:
        return '#757575'; // grey
    }
  };
  
  // Get payment status color
  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch(status) {
      case 'Paid':
        return '#43a047'; // green
      case 'Pending':
        return '#ff8a00'; // orange
      case 'Failed':
        return '#e53935'; // red
      default:
        return '#757575'; // grey
    }
  };
  
  // Filter orders by tab
  const getFilteredOrders = () => {
    if (tabValue === 0) return orders; // All orders
    
    const statusMap: { [key: number]: Order['status'] } = {
      1: 'Pending',
      2: 'Processing',
      3: 'Shipped',
      4: 'Delivered',
      5: 'Cancelled'
    };
    
    return orders.filter(order => order.status === statusMap[tabValue]);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  const filteredOrders = getFilteredOrders();
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
          Orders Management
        </Typography>
        
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
        
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Orders" />
              <Tab label="Pending" />
              <Tab label="Processing" />
              <Tab label="Shipped" />
              <Tab label="Delivered" />
              <Tab label="Cancelled" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ flexGrow: 1, maxWidth: 500 }}>
              <TextField
                fullWidth
                placeholder="Search orders by number, customer name, or email..."
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
          </Box>
        </Paper>
        
        <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'background.paper' } }}>
                  <TableCell>Order #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Payment</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow 
                      key={order._id}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                        '& td': { py: 2 }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(order.dateOrdered)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatCurrency(order.totalPrice)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(order.status)}15`,
                            color: getStatusColor(order.status),
                            fontWeight: 500,
                            borderRadius: 1
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={order.paymentStatus}
                          size="small"
                          sx={{
                            bgcolor: `${getPaymentStatusColor(order.paymentStatus)}15`,
                            color: getPaymentStatusColor(order.paymentStatus),
                            fontWeight: 500,
                            borderRadius: 1
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="View Order">
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => handleViewOrder(order)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, order._id)}
                            aria-haspopup="true"
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No orders found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleUpdateStatus('Processing')}>
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Processing</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus('Shipped')}>
          <ListItemIcon>
            <ShippingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Shipped</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus('Delivered')}>
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Delivered</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleUpdateStatus('Cancelled')}>
          <ListItemIcon>
            <CancelIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Cancel Order</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Email Customer</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* View Order Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Order Details: {selectedOrder.orderNumber}
                </Typography>
                <Chip
                  label={selectedOrder.status}
                  sx={{
                    bgcolor: `${getStatusColor(selectedOrder.status)}15`,
                    color: getStatusColor(selectedOrder.status),
                    fontWeight: 500,
                    borderRadius: 1
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Order Summary
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                        <Typography variant="body2">{formatDate(selectedOrder.dateOrdered)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
                        <Chip
                          label={selectedOrder.paymentStatus}
                          size="small"
                          sx={{
                            bgcolor: `${getPaymentStatusColor(selectedOrder.paymentStatus)}15`,
                            color: getPaymentStatusColor(selectedOrder.paymentStatus),
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 20,
                            borderRadius: 1
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Total:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(selectedOrder.totalPrice)}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Customer Information */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Customer Information
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedOrder.user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {selectedOrder.user.email}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
                        Shipping Address:
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingAddress.street}<br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}<br />
                        {selectedOrder.shippingAddress.country}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Order Items */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Order Items
                  </Typography>
                  <List>
                    {selectedOrder.items.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <Box sx={{ display: 'flex', width: '100%' }}>
                            {item.product.image && (
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  mr: 2,
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  flexShrink: 0
                                }}
                              >
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </Box>
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {item.product.name}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {formatCurrency(item.product.price * item.quantity)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">
                                  {formatCurrency(item.product.price)} × {item.quantity}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </ListItem>
                        {index < selectedOrder.items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Box sx={{ width: 200 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.totalPrice * 0.9)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Shipping:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.totalPrice * 0.05)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Tax:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.totalPrice * 0.05)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Total:</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{formatCurrency(selectedOrder.totalPrice)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button variant="outlined" startIcon={<PrintIcon />}>
                Print Invoice
              </Button>
              <Button variant="outlined" startIcon={<EmailIcon />}>
                Email Customer
              </Button>
              <Button variant="contained" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OrdersManagement; 