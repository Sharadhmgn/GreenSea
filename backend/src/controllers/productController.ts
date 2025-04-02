import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    let filter = {};
    
    // Filter by categories if provided
    if (req.query.categories) {
      const categoriesFilter = (req.query.categories as string).split(',');
      filter = { category: { $in: categoriesFilter } };
    }

    // Filter featured products
    if (req.query.featured) {
      filter = { 
        ...filter, 
        isFeatured: req.query.featured === 'true' 
      };
    }

    const productList = await Product.find(filter).populate('category');
    
    if (!productList) {
      return res.status(404).json({ message: 'No products found' });
    }
    
    res.send(productList);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get a single product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.send(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    const fileName = file.filename;

    // Create a new product
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured
    });

    const savedProduct = await product.save();
    
    if (!savedProduct) {
      return res.status(500).json({ message: 'The product cannot be created' });
    }
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Validate ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // Check if category exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update image if a new one is provided
    let imagePath = product.image;
    if (req.file) {
      const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
      const fileName = req.file.filename;
      imagePath = `${basePath}${fileName}`;

      // Remove old image file if it's not a URL
      const oldImagePath = product.image;
      if (oldImagePath && oldImagePath.includes('/uploads/')) {
        const oldFileName = oldImagePath.split('/uploads/')[1];
        if (oldFileName) {
          const filePath = path.join(__dirname, '../../uploads', oldFileName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagePath,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(500).json({ message: 'The product cannot be updated' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Find product first to get the image path
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(500).json({ message: 'The product cannot be deleted' });
    }

    // Delete image file
    const imagePath = product.image;
    if (imagePath && imagePath.includes('/uploads/')) {
      const fileName = imagePath.split('/uploads/')[1];
      if (fileName) {
        const filePath = path.join(__dirname, '../../uploads', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get product count
export const getProductCount = async (_req: Request, res: Response) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(200).json({ count: productCount });
  } catch (error) {
    console.error('Get product count error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get featured products with limit
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = req.params.count ? Number(req.params.count) : 4;
    const products = await Product.find({ isFeatured: true }).limit(limit).populate('category');
    
    if (!products) {
      return res.status(404).json({ message: 'No featured products found' });
    }
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Upload gallery images for a product
export const uploadGalleryImages = async (req: Request, res: Response) => {
  try {
    // Validate ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }

    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    const imagesPaths = files.map(file => `${basePath}${file.filename}`);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: { images: { $each: imagesPaths } }
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Upload gallery images error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}; 