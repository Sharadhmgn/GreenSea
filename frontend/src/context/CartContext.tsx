import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Product type
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  countInStock: number;
  description?: string;
  rating?: number;
}

// Cart item extends Product with quantity
export interface CartItem extends Product {
  quantity: number;
}

// Cart state
interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
}

// Cart context value
interface CartContextValue extends CartState {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  error: string | null;
}

// Cart action types
type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartState }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial cart state
const initialState: CartState & { error: string | null } = {
  items: [],
  itemCount: 0,
  total: 0,
  error: null
};

// Cart reducer
const cartReducer = (state: CartState & { error: string | null }, action: CartAction): CartState & { error: string | null } => {
  // Ensure state.items is always an array for safety
  const safeState = {
    ...state,
    items: Array.isArray(state.items) ? state.items : []
  };
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = safeState.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...safeState.items];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        // Ensure we don't exceed stock
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: Math.min(newQuantity, product.countInStock)
        };
        
        return {
          ...safeState,
          items: updatedItems,
          itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
          total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          quantity: Math.min(quantity, product.countInStock)
        };
        
        return {
          ...safeState,
          items: [...safeState.items, newItem],
          itemCount: safeState.itemCount + newItem.quantity,
          total: safeState.total + (newItem.price * newItem.quantity)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      const updatedItems = safeState.items.filter(item => item.id !== productId);
      
      return {
        ...safeState,
        items: updatedItems,
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
        total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(safeState, { type: 'REMOVE_ITEM', payload: { productId } });
      }
      
      const updatedItems = safeState.items.map(item => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.countInStock) // Ensure we don't exceed stock
          };
        }
        return item;
      });
      
      return {
        ...safeState,
        items: updatedItems,
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
        total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
    }
    
    case 'CLEAR_CART': {
      return { ...initialState };
    }
    
    case 'INIT_CART': {
      // Make sure the payload has the correct structure
      const payload = action.payload || {};
      return { 
        items: Array.isArray(payload.items) ? payload.items : [],
        itemCount: typeof payload.itemCount === 'number' ? payload.itemCount : 0,
        total: typeof payload.total === 'number' ? payload.total : 0,
        error: null
      };
    }
    
    case 'SET_ERROR': {
      return { ...safeState, error: action.payload };
    }
    
    default:
      return safeState;
  }
};

// Create context
const CartContext = createContext<CartContextValue | undefined>(undefined);

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth() || {};

  // Load cart from localStorage
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const localData = localStorage.getItem('cart');
      
      if (!localData) {
        return initialState;
      }
      
      const parsedData = JSON.parse(localData);
      
      // Check if the parsed data has the expected structure
      if (!parsedData || typeof parsedData !== 'object' || !Array.isArray(parsedData.items)) {
        // Data is corrupted or in wrong format, use initialState instead
        console.warn('Cart data in localStorage is corrupted, starting with empty cart');
        return initialState;
      }
      
      // Validate each item in the cart
      const validItems = parsedData.items.filter(item => 
        item && 
        typeof item === 'object' && 
        typeof item.id === 'string' && 
        typeof item.quantity === 'number' &&
        typeof item.price === 'number'
      );
      
      // Calculate new itemCount and total from validated items
      const itemCount = validItems.reduce((count, item) => count + (item.quantity || 0), 0);
      const total = validItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      
      return {
        items: validItems,
        itemCount,
        total,
        error: null
      };
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return initialState;
    }
  });
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        itemCount: state.itemCount,
        total: state.total
      }));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items, state.itemCount, state.total]);
  
  // Clear cart if user is admin
  useEffect(() => {
    if (user?.isAdmin && state.items.length > 0) {
      clearCart();
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Admin users cannot have items in cart. Cart has been cleared.' 
      });
      setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 5000);
    }
  }, [user?.isAdmin]);
  
  // Cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    // Prevent admin users from adding to cart
    if (user?.isAdmin) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Admin users cannot add items to cart. Please use a regular user account for shopping.' 
      });
      setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 5000);
      return;
    }
    
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };
  
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    // Prevent admin users from modifying cart
    if (user?.isAdmin) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Admin users cannot modify cart. Please use a regular user account for shopping.' 
      });
      setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 5000);
      return;
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider value={{
      ...state,
      cart: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Export provider as default
export default CartProvider; 