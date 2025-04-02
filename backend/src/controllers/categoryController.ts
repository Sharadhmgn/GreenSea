import { Request, Response } from 'express';
import Category from '../models/Category';

// Get all categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
      return res.status(404).json({ message: 'No categories found' });
    }
    res.status(200).json(categoryList);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get a single category by ID
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon, color } = req.body;
    
    // Create a new category
    const category = new Category({
      name,
      icon,
      color,
      image: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : ''
    });

    const savedCategory = await category.save();
    if (!savedCategory) {
      return res.status(400).json({ message: 'The category cannot be created' });
    }
    
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon, color } = req.body;
    
    // Find the category to update
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Prepare update data
    const updateData: any = { name, icon, color };
    
    // Add image if provided
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(400).json({ message: 'The category cannot be updated' });
    }
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}; 