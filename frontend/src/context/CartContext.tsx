import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
}

// Cart action types
type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartState };

// Initial cart state
const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        // Ensure we don't exceed stock
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: Math.min(newQuantity, product.countInStock)
        };
        
        return {
          ...state,
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
          ...state,
          items: [...state.items, newItem],
          itemCount: state.itemCount + newItem.quantity,
          total: state.total + (newItem.price * newItem.quantity)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      const updatedItems = state.items.filter(item => item.id !== productId);
      
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
        total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }
      
      const updatedItems = state.items.map(item => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.countInStock) // Ensure we don't exceed stock
          };
        }
        return item;
      });
      
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
        total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    case 'INIT_CART': {
      return action.payload;
    }
    
    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextValue | undefined>(undefined);

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load cart from localStorage
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : initialState;
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return initialState;
    }
  });
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  // Cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };
  
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
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