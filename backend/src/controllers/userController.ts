import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, street, apartment, zip, city, country } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      passwordHash,
      phone,
      street,
      apartment,
      zip,
      city,
      country,
      isAdmin: false // Default to regular user
    });

    const savedUser = await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser.id, isAdmin: savedUser.isAdmin },
      process.env.JWT_SECRET || 'green_seafoods_secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
      token
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'green_seafoods_secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get all users (admin only)
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, street, apartment, zip, city, country } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is updating their own profile or is an admin
    if (req.user?.userId !== user.id && !req.user?.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        street,
        apartment,
        zip,
        city,
        country
      },
      { new: true }
    ).select('-passwordHash');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}; 