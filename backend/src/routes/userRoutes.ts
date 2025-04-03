import express from 'express';
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController';
import { isAuth, isAdmin } from '../middlewares/auth';
import * as authController from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTPOnly);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/', isAuth, isAdmin, getUsers);
router.get('/:id', isAuth, getUserById);
router.put('/:id', isAuth, updateUser);
router.delete('/:id', isAuth, isAdmin, deleteUser);
router.get('/profile', isAuth, getUserProfile);
router.put('/profile', isAuth, updateUserProfile);

// Admin routes
router.get('/', isAuth, isAdmin, getUsers);
router.delete('/:id', isAuth, isAdmin, deleteUser);
router.put('/:id/role', isAuth, isAdmin, updateUser);

export default router; 