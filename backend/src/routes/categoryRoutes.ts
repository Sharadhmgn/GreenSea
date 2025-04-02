import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { isAuth, isAdmin } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes - admin only
router.post('/', isAuth, isAdmin, upload.single('image'), createCategory);
router.put('/:id', isAuth, isAdmin, upload.single('image'), updateCategory);
router.delete('/:id', isAuth, isAdmin, deleteCategory);

export default router; 