import api from './api';
import { CartItem } from '../context/CartContext';
import * as XLSX from 'xlsx';

// Order status types
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

// Order interface
export interface Order {
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
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  dateOrdered: string;
}

// Shipping address interface
export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// Mock function for creating orders (in a real app, this would call your backend API)
export const createOrder = async (
  items: CartItem[], 
  totalPrice: number, 
  shippingAddress: ShippingAddress, 
  userId: string,
  userName?: string,
  userEmail?: string
): Promise<Order> => {
  try {
    // In a real application, you would make an API call here
    // For now, we'll mock the response
    
    const orderData = {
      items: items.map(item => ({
        quantity: item.quantity,
        product: {
          _id: item.id,
          name: item.name,
          price: item.price,
          image: item.image
        }
      })),
      totalPrice,
      shippingAddress,
      user: {
        _id: userId
      }
    };
    
    // Simulate API call
    // const response = await api.post('/orders', orderData);
    
    // For demo purposes, we'll create a mock order
    const mockOrder: Order = {
      _id: `order_${Date.now()}`,
      orderNumber: `GSF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      user: {
        _id: userId,
        name: userName || 'Guest User',
        email: userEmail || 'guest@example.com'
      },
      totalPrice,
      shippingAddress,
      items: orderData.items,
      status: 'Pending',
      paymentStatus: 'Paid', // Assuming payment is made at checkout
      dateOrdered: new Date().toISOString()
    };
    
    // In a real app, the order would be saved to the database
    // For now, we'll save to localStorage for demo purposes
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(mockOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return mockOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

// Function to get all orders (mock)
export const getOrders = async (): Promise<Order[]> => {
  try {
    // In a real application, you would make an API call here
    // For now, we'll get from localStorage
    const existingOrders = localStorage.getItem('orders');
    return existingOrders ? JSON.parse(existingOrders) : [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// Function to update order status (mock)
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  try {
    // In a real application, you would make an API call here
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    
    const updatedOrders = orders.map((order: Order) => {
      if (order._id === orderId) {
        return { ...order, status };
      }
      return order;
    });
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    const updatedOrder = updatedOrders.find((order: Order) => order._id === orderId);
    if (!updatedOrder) throw new Error('Order not found');
    
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

// Function to export orders to Excel
export const exportOrdersToExcel = (orders: Order[], fileName: string = 'orders.xlsx'): void => {
  // Convert orders to worksheet format
  const worksheet = XLSX.utils.json_to_sheet(
    orders.map(order => ({
      'Order Number': order.orderNumber || 'N/A',
      'Customer': order.user?.name || 'N/A',
      'Email': order.user?.email || 'N/A',
      'Total Price': order.totalPrice !== null && order.totalPrice !== undefined 
        ? `$${order.totalPrice.toFixed(2)}` 
        : '$0.00',
      'Status': order.status || 'N/A',
      'Payment Status': order.paymentStatus || 'N/A',
      'Date': order.dateOrdered ? new Date(order.dateOrdered).toLocaleDateString() : 'N/A',
      'Shipping Address': order.shippingAddress 
        ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.country || ''}`
        : 'N/A'
    }))
  );
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  
  // Generate and download the Excel file
  XLSX.writeFile(workbook, fileName);
};

// Function to export products to Excel
export const exportProductsToExcel = (products: any[], fileName: string = 'products.xlsx'): void => {
  // Convert products to worksheet format
  const worksheet = XLSX.utils.json_to_sheet(
    products.map(product => ({
      'ID': product._id || 'N/A',
      'Name': product.name || 'N/A',
      'Category': product.category?.name || 'Uncategorized',
      'Price': product.price !== null && product.price !== undefined 
        ? `$${product.price.toFixed(2)}`
        : '$0.00',
      'In Stock': product.countInStock !== null && product.countInStock !== undefined
        ? product.countInStock 
        : 0,
      'Description': product.description || 'No description',
      'Featured': product.isFeatured ? 'Yes' : 'No',
      'Date Created': product.dateCreated 
        ? new Date(product.dateCreated).toLocaleDateString()
        : 'N/A'
    }))
  );
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  // Generate and download the Excel file
  XLSX.writeFile(workbook, fileName);
};

// Function to export categories to Excel
export const exportCategoriesToExcel = (categories: any[], fileName: string = 'categories.xlsx'): void => {
  // Convert categories to worksheet format
  const worksheet = XLSX.utils.json_to_sheet(
    categories.map(category => ({
      'ID': category._id || 'N/A',
      'Name': category.name || 'Unnamed Category',
      'Icon': category.icon || 'N/A',
      'Color': category.color || 'N/A'
    }))
  );
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
  
  // Generate and download the Excel file
  XLSX.writeFile(workbook, fileName);
};

// Function to export users to Excel
export const exportUsersToExcel = (users: any[], fileName: string = 'users.xlsx'): void => {
  // Convert users to worksheet format
  const worksheet = XLSX.utils.json_to_sheet(
    users.map(user => ({
      'ID': user.id || user._id || 'N/A',
      'Name': user.name || 'Unnamed User',
      'Email': user.email || 'N/A',
      'Phone': user.phone || 'N/A',
      'Role': user.isAdmin ? 'Admin' : 'Customer',
      'Date Created': user.dateCreated
        ? new Date(user.dateCreated).toLocaleDateString()
        : 'N/A',
      'Address': user.address?.city 
        ? `${user.address.street || ''} ${user.address.apartment || ''}, ${user.address.city}, ${user.address.zip || ''}, ${user.address.country || ''}`
        : 'N/A'
    }))
  );
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  
  // Generate and download the Excel file
  XLSX.writeFile(workbook, fileName);
};

export default {
  createOrder,
  getOrders,
  updateOrderStatus,
  exportOrdersToExcel,
  exportProductsToExcel,
  exportCategoriesToExcel,
  exportUsersToExcel
}; 