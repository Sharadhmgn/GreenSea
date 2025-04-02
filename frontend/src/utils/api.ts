import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Include credentials (cookies) with requests
  withCredentials: false  // Set to false since we're using token-based auth
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You could also redirect to login page here if needed
    }
    
    // Log additional info for CORS or network errors
    if (error.message === 'Network Error') {
      console.error('Network or CORS error. Check if the backend server is running and CORS is properly configured.');
    }
    
    return Promise.reject(error);
  }
);

export default api; 