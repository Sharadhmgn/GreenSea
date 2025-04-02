import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getTotalSales,
  getOrdersCount,
  getUserOrders
} from '../controllers/orderController';
import { isAuth, isAdmin } from '../middlewares/auth';

const router = express.Router();

// Public route for creating orders
router.post('/', createOrder);

// Protected routes
router.get('/', isAuth, isAdmin, getOrders);
router.get('/:id', isAuth, getOrder);
router.put('/:id', isAuth, isAdmin, updateOrderStatus);
router.delete('/:id', isAuth, isAdmin, deleteOrder);

// Statistics routes
router.get('/get/totalsales', isAuth, isAdmin, getTotalSales);
router.get('/get/count', isAuth, isAdmin, getOrdersCount);

// User specific orders
router.get('/get/userorders/:userId', isAuth, getUserOrders);

export default router; 