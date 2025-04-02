import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; isAdmin: boolean };
    }
  }
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'green_seafoods_secret_key');
    req.user = decoded as { userId: string; isAdmin: boolean };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin privileges required' });
  }
}; 