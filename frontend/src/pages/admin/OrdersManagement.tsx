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
  Check as CheckIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import OrderService, { Order as OrderType } from '../../utils/OrderService';

const OrdersManagement = () => {
  const navigate = useNavigate();
  
  // State
  const [orders, setOrders] = useState<OrderType[]>([]);
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
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Fetch orders from our service instead of mock data
        const fetchedOrders = await OrderService.getOrders();
        
        // Filter orders based on selected tab (status)
        let filteredOrders = fetchedOrders;
        
        // If not showing 'All' (tab value 0), filter by status
        if (tabValue !== 0) {
          const statusMap = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
          const statusFilter = statusMap[tabValue];
          if (statusFilter !== 'All') {
            filteredOrders = fetchedOrders.filter(order => order.status === statusFilter);
          }
        }
        
        // Apply search filter if any
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredOrders = filteredOrders.filter(order => 
            order.orderNumber.toLowerCase().includes(query) || 
            order.user.name.toLowerCase().includes(query) ||
            order.user.email.toLowerCase().includes(query)
          );
        }
        
        setOrders(filteredOrders);
        setTotalOrders(filteredOrders.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [tabValue, searchQuery]);
  
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
  const handleViewOrder = (order: OrderType) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
    handleMenuClose();
  };
  
  // Update order status
  const handleUpdateStatus = async (newStatus: OrderType['status']) => {
    if (!selectedOrderId) return;
    
    try {
      await OrderService.updateOrderStatus(selectedOrderId, newStatus);
      
      // Update orders in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === selectedOrderId ? { ...order, status: newStatus } : order
        )
      );
      
      setSuccessMessage(`Order status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      handleMenuClose();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
      setTimeout(() => setError(''), 3000);
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
  const getStatusColor = (status: OrderType['status']) => {
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
  const getPaymentStatusColor = (status: OrderType['paymentStatus']) => {
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
    
    const statusMap: { [key: number]: OrderType['status'] } = {
      1: 'Pending',
      2: 'Processing',
      3: 'Shipped',
      4: 'Delivered',
      5: 'Cancelled'
    };
    
    return orders.filter(order => order.status === statusMap[tabValue]);
  };
  
  // Add a function to handle Excel export
  const handleExportToExcel = () => {
    try {
      // Filter out any invalid orders before passing to the export function
      const validOrders = orders.filter(order => 
        order && 
        typeof order === 'object' && 
        order.orderNumber && 
        order.user
      );
      
      if (validOrders.length === 0) {
        setError('No valid orders to export');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      OrderService.exportOrdersToExcel(validOrders);
      setSuccessMessage('Orders exported to Excel successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error exporting orders:', error);
      setError(`Failed to export orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setError(''), 5000);
    }
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
            <Box sx={{ display: 'flex', gap: 2, mb: { xs: 2, md: 0 } }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportToExcel}
                sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
              >
                Export to Excel
              </Button>
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