import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { seedInitialData } from './seedData';

// Import routes
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 8080;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://green-sea.vercel.app',
  'https://green-seafoods.vercel.app',
  'https://greensea-frontend.vercel.app'
];

// CORS Configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(null, true); // Temporarily allow all origins during troubleshooting
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'CORS is working properly', 
    origin: req.headers.origin || 'No origin header',
    headers: req.headers
  });
});

// Start server function
function startServer() {
  const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Health check available at http://localhost:${PORT}/api/health`);
  });

  // Handle server errors
  server.on('error', (error) => {
    console.error('Server error:', error);
  });

  // Keep the server process running
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
}

// Connect to MongoDB and start server
async function initialize() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/green-seafoods');
    console.log('Connected to MongoDB');
    
    // Seed initial data including admin user
    try {
      await seedInitialData();
      console.log('Data seeding completed');
    } catch (seedError) {
      console.error('Error seeding data:', seedError);
      console.log('Continuing with server startup despite seeding error');
    }
    
    // Start the server
    startServer();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Starting server without MongoDB connection...');
    startServer();
  }
}

// Start the application
initialize();

export default app; 