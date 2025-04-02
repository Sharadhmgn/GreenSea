import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as CartIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

// Types for dashboard data
interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
  pendingOrders: number;
}

// Type for recent orders
interface RecentOrder {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
  };
  totalPrice: number;
  status: string;
  dateOrdered: string;
}

const AdminDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real application, you would fetch this data from your API
        // For now, we'll use placeholder data
        
        // Mock API call for dashboard stats
        // const statsResponse = await api.get('/admin/dashboard/stats');
        const statsData: DashboardStats = {
          totalProducts: 48,
          totalOrders: 124,
          totalRevenue: 8764.50,
          totalCustomers: 87,
          lowStockProducts: 5,
          pendingOrders: 12
        };
        
        // Mock API call for recent orders
        // const ordersResponse = await api.get('/admin/orders/recent');
        const ordersData: RecentOrder[] = [
          {
            _id: '1',
            orderNumber: 'ORD-2023-001',
            user: { name: 'John Doe' },
            totalPrice: 129.99,
            status: 'Delivered',
            dateOrdered: '2023-06-10T14:30:00Z'
          },
          {
            _id: '2',
            orderNumber: 'ORD-2023-002',
            user: { name: 'Jane Smith' },
            totalPrice: 76.50,
            status: 'Processing',
            dateOrdered: '2023-06-12T09:15:00Z'
          },
          {
            _id: '3',
            orderNumber: 'ORD-2023-003',
            user: { name: 'Robert Johnson' },
            totalPrice: 224.75,
            status: 'Shipped',
            dateOrdered: '2023-06-11T16:45:00Z'
          },
          {
            _id: '4',
            orderNumber: 'ORD-2023-004',
            user: { name: 'Emily Davis' },
            totalPrice: 95.20,
            status: 'Processing',
            dateOrdered: '2023-06-13T11:20:00Z'
          },
          {
            _id: '5',
            orderNumber: 'ORD-2023-005',
            user: { name: 'Michael Wilson' },
            totalPrice: 156.80,
            status: 'Pending',
            dateOrdered: '2023-06-13T13:10:00Z'
          }
        ];
        
        setStats(statsData);
        setRecentOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
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
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return theme.palette.success.main;
      case 'shipped':
        return theme.palette.info.main;
      case 'processing':
        return theme.palette.warning.main;
      case 'pending':
        return theme.palette.secondary.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl">
      {/* Welcome Header */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.name || 'Admin'}! Here's what's happening with your store today.
        </Typography>
      </Box>
      
      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              backgroundColor: 'rgba(46, 125, 50, 0.07)',
              borderLeft: '4px solid',
              borderColor: 'primary.main',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">Products</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {stats?.totalProducts || 0}
            </Typography>
            <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {stats?.lowStockProducts || 0} low stock
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              backgroundColor: 'rgba(25, 118, 210, 0.07)',
              borderLeft: '4px solid',
              borderColor: 'secondary.main',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CartIcon sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">Orders</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {stats?.totalOrders || 0}
            </Typography>
            <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {stats?.pendingOrders || 0} pending
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              backgroundColor: 'rgba(255, 138, 0, 0.07)',
              borderLeft: '4px solid',
              borderColor: 'warning.main',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MoneyIcon sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">Revenue</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {formatCurrency(stats?.totalRevenue || 0)}
            </Typography>
            <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                This month
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              backgroundColor: 'rgba(76, 175, 80, 0.07)',
              borderLeft: '4px solid',
              borderColor: 'success.main',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">Customers</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {stats?.totalCustomers || 0}
            </Typography>
            <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total registered
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Quick Access Links */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
            Quick Actions
          </Typography>
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Button
            component={RouterLink}
            to="/admin/products"
            variant="outlined"
            color="primary"
            startIcon={<InventoryIcon />}
            fullWidth
            sx={{ 
              p: 2,
              justifyContent: 'flex-start',
              borderRadius: 2,
              height: '100%',
              textAlign: 'left',
              textTransform: 'none',
            }}
          >
            Manage Products
          </Button>
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Button
            component={RouterLink}
            to="/admin/categories"
            variant="outlined"
            color="secondary"
            startIcon={<CategoryIcon />}
            fullWidth
            sx={{ 
              p: 2,
              justifyContent: 'flex-start',
              borderRadius: 2,
              height: '100%',
              textAlign: 'left',
              textTransform: 'none',
            }}
          >
            Manage Categories
          </Button>
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Button
            component={RouterLink}
            to="/admin/orders"
            variant="outlined"
            color="info"
            startIcon={<CartIcon />}
            fullWidth
            sx={{ 
              p: 2,
              justifyContent: 'flex-start',
              borderRadius: 2,
              height: '100%',
              textAlign: 'left',
              textTransform: 'none',
            }}
          >
            View Orders
          </Button>
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Button
            component={RouterLink}
            to="/admin/products/new"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ 
              p: 2,
              borderRadius: 2,
              height: '100%',
              textTransform: 'none',
            }}
          >
            Add New Product
          </Button>
        </Grid>
      </Grid>
      
      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
            Recent Orders
          </Typography>
          <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <List sx={{ width: '100%', p: 0 }}>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order._id}>
                  <ListItem
                    sx={{ 
                      py: 2,
                      px: 3,
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                    }}
                    secondaryAction={
                      <Button
                        component={RouterLink}
                        to={`/admin/orders/${order._id}`}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '0.75rem', minWidth: '60px', height: '28px' }}
                      >
                        View
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {order.orderNumber}
                          </Typography>
                          <Box 
                            sx={{ 
                              ml: 2,
                              px: 1.5, 
                              py: 0.5, 
                              borderRadius: 1, 
                              bgcolor: 'rgba(0, 0, 0, 0.04)',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontWeight: 600, 
                                color: getStatusColor(order.status)
                              }}
                            >
                              {order.status}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', mt: 0.5 }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mr: 3 }}
                          >
                            {order.user.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mr: 3 }}
                          >
                            {formatDate(order.dateOrdered)}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.primary"
                            sx={{ fontWeight: 600 }}
                          >
                            {formatCurrency(order.totalPrice)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button 
                component={RouterLink}
                to="/admin/orders"
                color="primary"
              >
                View All Orders
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 