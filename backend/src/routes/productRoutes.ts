import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
  getFeaturedProducts,
  uploadGalleryImages
} from '../controllers/productController';
import { isAuth, isAdmin } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/get/count', getProductCount);
router.get('/get/featured/:count', getFeaturedProducts);

// Protected routes - admin only
router.post('/', isAuth, isAdmin, upload.single('image'), createProduct);
router.put('/:id', isAuth, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);
router.put('/gallery-images/:id', isAuth, isAdmin, upload.array('images', 10), uploadGalleryImages);

export default router; 