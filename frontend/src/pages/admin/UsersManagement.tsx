import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Alert,
  Chip,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  FormControlLabel,
  Switch,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Download as DownloadIcon,
  FileDownload as FileDownloadIcon,
  PermIdentity as PermIdentityIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import api from '../../utils/api';
import OrderService from '../../utils/OrderService';

// Mock data for demonstration - in a real app, this would come from your API
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  dateCreated: string;
  address?: {
    street?: string;
    apartment?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
}

const initialUsers: User[] = [
  {
    id: 'usr_1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    isAdmin: false,
    dateCreated: '2023-01-15',
    address: {
      street: '123 Main St',
      city: 'New York',
      zip: '10001',
      country: 'USA'
    }
  },
  {
    id: 'usr_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '9876543210',
    isAdmin: true,
    dateCreated: '2023-02-20',
    address: {
      street: '456 Park Ave',
      apartment: 'Apt 303',
      city: 'Boston',
      zip: '02101',
      country: 'USA'
    }
  },
  {
    id: 'usr_3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    isAdmin: false,
    dateCreated: '2023-03-10'
  }
];

const UsersManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterAdmin, setFilterAdmin] = useState<boolean | null>(null);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    filterUsers();
  }, [searchTerm, users, filterAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from your API
      // const response = await api.get('/users');
      // setUsers(response.data);
      
      // For demo, use mock data
      setUsers(initialUsers);
      setFilteredUsers(initialUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm)) ||
        (user.address?.city && user.address.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply admin filter
    if (filterAdmin !== null) {
      filtered = filtered.filter(user => user.isAdmin === filterAdmin);
    }
    
    setFilteredUsers(filtered);
  };

  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      isAdmin: user.isAdmin,
      address: {
        street: user.address?.street || '',
        apartment: user.address?.apartment || '',
        city: user.address?.city || '',
        zip: user.address?.zip || '',
        country: user.address?.country || ''
      }
    });
    setOpenDialog(true);
  };

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
      address: {
        street: '',
        apartment: '',
        city: '',
        zip: '',
        country: ''
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setEditFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditFormData({
        ...editFormData,
        [parent]: {
          ...editFormData[parent as keyof typeof editFormData] as Record<string, unknown>,
          [child]: value
        }
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.checked
    });
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      
      if (selectedUser) {
        // Update existing user
        // In a real app, you would update via API
        // await api.put(`/users/${selectedUser.id}`, editFormData);
        
        // For demo, update the local state
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id ? { ...user, ...editFormData } : user
        );
        setUsers(updatedUsers);
        setSuccessMessage('User updated successfully');
      } else {
        // Create new user
        // In a real app, you would create via API
        // const response = await api.post('/users', editFormData);
        
        // For demo, add to local state with a mock ID
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: editFormData.name || '',
          email: editFormData.email || '',
          phone: editFormData.phone,
          isAdmin: editFormData.isAdmin || false,
          dateCreated: new Date().toISOString().split('T')[0],
          address: editFormData.address
        };
        setUsers([...users, newUser]);
        setSuccessMessage('User created successfully');
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      setErrorMessage('Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, you would delete via API
      // await api.delete(`/users/${userId}`);
      
      // For demo, remove from local state
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setSuccessMessage('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterAdmin(null);
  };

  const handleExportToExcel = () => {
    try {
      // Use the existing OrderService to export, or create a specific method for users
      // In a real app, you might want to create a dedicated UserService
      OrderService.exportUsersToExcel(users, 'users.xlsx');
      setSuccessMessage('Users exported to Excel successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      setErrorMessage('Failed to export users. Please try again.');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        User Management
      </Typography>
      
      {/* Filters and actions */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          gap: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2
        }}
      >
        <TextField
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel>User Type</InputLabel>
          <Select
            value={filterAdmin === null ? '' : filterAdmin ? 'admin' : 'regular'}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setFilterAdmin(null);
              } else {
                setFilterAdmin(value === 'admin');
              }
            }}
            label="User Type"
          >
            <MenuItem value="">All Users</MenuItem>
            <MenuItem value="admin">Admins</MenuItem>
            <MenuItem value="regular">Regular Users</MenuItem>
          </Select>
        </FormControl>
        
        <Tooltip title="Clear Filters">
          <IconButton onClick={handleClearFilters}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Refresh">
          <IconButton onClick={fetchUsers}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewUser}
          sx={{
            backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          }}
        >
          Add User
        </Button>
      </Paper>
      
      {/* Users table */}
      <Paper 
        elevation={2} 
        sx={{ 
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: `0 8px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.08) }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                          {user.name}
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={user.isAdmin ? <AdminPanelSettingsIcon /> : <PermIdentityIcon />}
                          label={user.isAdmin ? 'Admin' : 'Customer'} 
                          color={user.isAdmin ? 'primary' : 'default'}
                          size="small"
                          variant={user.isAdmin ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>{new Date(user.dateCreated).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {user.address?.city ? (
                          <Tooltip title={`${user.address?.street || ''} ${user.address?.apartment || ''}, ${user.address?.city}, ${user.address?.country}`}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                              {user.address.city}, {user.address.country || 'N/A'}
                            </Box>
                          </Tooltip>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(user)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                          size="small"
                          sx={{ ml: 1 }}
                          disabled={user.isAdmin} // Prevent deleting admins
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Edit/Add User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editFormData.name || ''}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editFormData.email || ''}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editFormData.phone || ''}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData.isAdmin || false}
                    onChange={handleSwitchChange}
                    name="isAdmin"
                    color="primary"
                  />
                }
                label="Admin User"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Address Information
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address.street"
                value={editFormData.address?.street || ''}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apartment/Unit"
                name="address.apartment"
                value={editFormData.address?.apartment || ''}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={editFormData.address?.city || ''}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Zip/Postal Code"
                name="address.zip"
                value={editFormData.address?.zip || ''}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={editFormData.address?.country || ''}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveUser} 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save User'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success and error messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersManagement; 