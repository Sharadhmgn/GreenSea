import axios from 'axios';
// Define base API URL - adjust based on your deployment environment
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Include credentials (cookies) with requests
  withCredentials: false  // Set to false since we're using token-based auth
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      const { status } = error.response;
      
      // Handle 401 Unauthorized (expired token or not logged in)
      if (status === 401) {
        // Clear token and redirect to login if needed
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // You could redirect to login here, or handle this in your components
        // window.location.href = '/login';
      }
      
      // Handle 403 Forbidden (not enough permissions)
      if (status === 403) {
        console.error('Permission denied');
      }
      
      // Handle 500 Server Error
      if (status >= 500) {
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 