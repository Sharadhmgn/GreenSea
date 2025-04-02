import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DebugInfo = () => {
  const { isAuthenticated, user } = useAuth();
  const [localStorageUser, setLocalStorageUser] = useState<any>(null);
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null);

  useEffect(() => {
    // Get data from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr) {
      try {
        setLocalStorageUser(JSON.parse(userStr));
      } catch (e) {
        setLocalStorageUser({ error: 'Failed to parse user JSON' });
      }
    }
    
    setLocalStorageToken(token);
  }, []);

  const refreshData = () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr) {
      try {
        setLocalStorageUser(JSON.parse(userStr));
      } catch (e) {
        setLocalStorageUser({ error: 'Failed to parse user JSON' });
      }
    } else {
      setLocalStorageUser(null);
    }
    
    setLocalStorageToken(token);
  };

  return (
    <Paper sx={{ p: 3, m: 2, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>Debug Authentication Info</Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Auth Context State:</Typography>
        <Typography variant="body2">isAuthenticated: {isAuthenticated ? 'true' : 'false'}</Typography>
        <Typography variant="body2">User: {user ? JSON.stringify(user, null, 2) : 'null'}</Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">LocalStorage Data:</Typography>
        <Typography variant="body2">
          user: {localStorageUser ? JSON.stringify(localStorageUser, null, 2) : 'null'}
        </Typography>
        <Typography variant="body2">
          token: {localStorageToken ? `${localStorageToken.substring(0, 15)}...` : 'null'}
        </Typography>
      </Box>
      
      <Button variant="outlined" onClick={refreshData}>
        Refresh Data
      </Button>
    </Paper>
  );
};

export default DebugInfo; 