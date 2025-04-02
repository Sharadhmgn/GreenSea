import express from 'express';
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { isAuth, isAdmin } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/', isAuth, isAdmin, getUsers);
router.get('/:id', isAuth, getUserById);
router.put('/:id', isAuth, updateUser);
router.delete('/:id', isAuth, isAdmin, deleteUser);

export default router; 