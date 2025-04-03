import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../utils/api';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  avatar?: string;
}

// Auth state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Auth context value
interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Registration data type
interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street?: string;
    apartment?: string;
    zip?: string;
    city?: string;
    country?: string;
  };
}

// Auth action types
type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
      
    case 'AUTH_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
      
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load auth from localStorage
  const [state, dispatch] = useReducer(authReducer, initialState, () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        // Set axios auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return {
          ...initialState,
          isAuthenticated: true,
          user: JSON.parse(user),
          token,
        };
      }
      
      return initialState;
    } catch (error) {
      return initialState;
    }
  });
  
  // Session timeout timer reference
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to reset session timeout
  const resetSessionTimeout = () => {
    // Clear existing timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    
    // Skip timeout for admin users
    if (state.user?.isAdmin) {
      return;
    }
    
    // Set new timeout
    if (state.isAuthenticated) {
      sessionTimeoutRef.current = setTimeout(() => {
        console.log('Session timeout - logging out user');
        dispatch({ type: 'LOGOUT' });
      }, SESSION_TIMEOUT);
    }
  };
  
  // Set up event listeners for user activity
  useEffect(() => {
    const userActivity = () => {
      resetSessionTimeout();
    };
    
    // Add event listeners
    window.addEventListener('mousemove', userActivity);
    window.addEventListener('keydown', userActivity);
    window.addEventListener('click', userActivity);
    window.addEventListener('scroll', userActivity);
    window.addEventListener('touchstart', userActivity);
    
    // Initial timeout setup
    resetSessionTimeout();
    
    // Cleanup function
    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      window.removeEventListener('mousemove', userActivity);
      window.removeEventListener('keydown', userActivity);
      window.removeEventListener('click', userActivity);
      window.removeEventListener('scroll', userActivity);
      window.removeEventListener('touchstart', userActivity);
    };
  }, [state.isAuthenticated, state.user?.isAdmin]);
  
  // Set axios auth header when token changes
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);
  
  // Save auth to localStorage when it changes
  useEffect(() => {
    if (state.isAuthenticated && state.token && state.user) {
      console.log('Saving authenticated user to localStorage:', state.user);
      console.log('Is user admin?', state.user.isAdmin);
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [state.isAuthenticated, state.token, state.user]);
  
  // Auth actions
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/users/login', { email, password });
      
      // Log the entire response for debugging
      console.log('Login API response:', response.data);
      
      // Extract user and token from response data
      // The response contains the user object directly, not nested
      const userData = response.data;
      const token = userData.token;
      
      // Remove token from userData to avoid duplication
      const { token: _, ...userWithoutToken } = userData;
      
      console.log('User data extracted:', userWithoutToken);
      console.log('Is user admin?', userWithoutToken.isAdmin);
      
      // Ensure isAdmin property is properly set in the user object
      const userWithAdminStatus = {
        ...userWithoutToken,
        isAdmin: userWithoutToken.isAdmin === true // Ensure it's a boolean value
      };
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: userWithAdminStatus, token } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Authentication failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      throw new Error(message);
    }
  };
  
  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/users/register', userData);
      const { user, token } = response.data;
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      throw new Error(message);
    }
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };
  
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export provider as default
export default AuthProvider; 