import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category';
import Product from './models/Product';
import bcrypt from 'bcryptjs';
import User from './models/User';

dotenv.config();

// MongoDB connection
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('MongoDB connected for data seeding');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Categories data
const categories = [
  {
    name: 'Fish',
    icon: 'fish',
    color: '#1a5f7a',
    image: 'https://images.unsplash.com/photo-1513040260736-29d6e14a1f34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1336&q=80'
  },
  {
    name: 'Shellfish',
    icon: 'shellfish',
    color: '#ff8a00',
    image: 'https://images.unsplash.com/photo-1565680018160-d349fe53de21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  },
  {
    name: 'Premium',
    icon: 'star',
    color: '#cc6e00',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  },
  {
    name: 'Prepared',
    icon: 'food',
    color: '#3a7f9a',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80'
  }
];

// Seed Categories
const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    console.log('Categories cleared');
    
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

// Seed Products based on created categories
const seedProducts = async (categories: any[]) => {
  try {
    await Product.deleteMany({});
    console.log('Products cleared');
    
    const fishCategory = categories.find(cat => cat.name === 'Fish')._id;
    const shellfishCategory = categories.find(cat => cat.name === 'Shellfish')._id;
    const premiumCategory = categories.find(cat => cat.name === 'Premium')._id;
    const preparedCategory = categories.find(cat => cat.name === 'Prepared')._id;
    
    const products = [
      {
        name: 'Fresh Atlantic Salmon',
        description: 'Premium wild-caught Atlantic salmon, perfect for grilling or baking.',
        richDescription: 'Our Atlantic Salmon is sustainably sourced and flash-frozen to preserve its fresh flavor and nutrients. Each fillet is individually vacuum-packed for convenience.',
        image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        price: 24.99,
        category: fishCategory,
        countInStock: 15,
        rating: 4.8,
        numReviews: 24,
        isFeatured: true
      },
      {
        name: 'Jumbo Shrimp',
        description: 'Large, succulent shrimp perfect for grilling, cocktails, or pasta dishes.',
        richDescription: 'Our Jumbo Shrimp are wild-caught in the Gulf of Mexico. They come deveined and ready to cook, making meal prep quick and easy.',
        image: 'https://images.unsplash.com/photo-1565680018160-d349fe53de21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
        price: 19.99,
        category: shellfishCategory,
        countInStock: 25,
        rating: 4.5,
        numReviews: 18,
        isFeatured: true
      },
      {
        name: 'Fresh Oysters',
        description: 'Freshly harvested oysters, perfect for raw consumption or grilling.',
        richDescription: 'Our oysters are harvested daily from the pristine waters of the Pacific Northwest. They come cleaned and ready to shuck, and are ideal for both raw enjoyment or cooking.',
        image: 'https://images.unsplash.com/photo-1642166805142-0426a75902e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
        price: 29.99,
        category: shellfishCategory,
        countInStock: 20,
        rating: 4.7,
        numReviews: 15,
        isFeatured: true
      },
      {
        name: 'Lobster Tails',
        description: 'Premium lobster tails, perfect for special occasions and celebrations.',
        richDescription: 'Our cold-water lobster tails are sourced from Maine and come split for easy preparation. These succulent tails are perfect for broiling, grilling, or boiling.',
        image: 'https://images.unsplash.com/photo-1559564207-09c99dc78a70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
        price: 39.99,
        category: premiumCategory,
        countInStock: 10,
        rating: 4.9,
        numReviews: 32,
        isFeatured: true
      },
      {
        name: 'Alaska King Crab Legs',
        description: 'Massive, meaty king crab legs from the icy waters of Alaska.',
        richDescription: 'Our Alaska King Crab legs are wild-caught in the Bering Sea. These enormous, meaty legs are pre-cooked and flash-frozen to lock in their sweet, delicate flavor.',
        image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
        price: 49.99,
        category: premiumCategory,
        countInStock: 8,
        rating: 4.9,
        numReviews: 28,
        isFeatured: false
      },
      {
        name: 'Wild Caught Tuna Steaks',
        description: 'Sushi-grade yellowfin tuna steaks, perfect for searing or enjoying raw.',
        richDescription: 'Our yellowfin tuna steaks are sustainably caught and immediately flash-frozen at sea to preserve their fresh flavor and bright color. Perfect for sashimi, poke bowls, or a quick sear.',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
        price: 28.99,
        category: fishCategory,
        countInStock: 12,
        rating: 4.7,
        numReviews: 19,
        isFeatured: false
      },
      {
        name: 'Seafood Paella Kit',
        description: 'Everything you need to make an authentic Spanish seafood paella at home.',
        richDescription: 'Our Seafood Paella Kit includes premium short-grain rice, saffron, and a mix of fresh seafood including shrimp, mussels, and calamari. Just add your favorite vegetables and follow our simple recipe for a restaurant-quality paella.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
        price: 35.99,
        category: preparedCategory,
        countInStock: 15,
        rating: 4.6,
        numReviews: 12,
        isFeatured: false
      },
      {
        name: 'Smoked Salmon',
        description: 'Traditional cold-smoked salmon with a delicate flavor and silky texture.',
        richDescription: 'Our Smoked Salmon is cured and smoked using traditional methods to create a buttery texture and delicate flavor. Perfect on bagels, in pasta, or as part of a charcuterie board.',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        price: 18.99,
        category: preparedCategory,
        countInStock: 22,
        rating: 4.4,
        numReviews: 15,
        isFeatured: false
      }
    ];
    
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);
    
    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Create admin user if it doesn't exist
export const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@greenseafoods.com';
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      passwordHash,
      phone: '1234567890',
      street: 'Admin Street',
      apartment: 'Admin Apartment',
      zip: '12345',
      city: 'Admin City',
      country: 'Admin Country',
      isAdmin: true
    });
    
    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Admin login: admin@greenseafoods.com / password: admin123');
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }
};

// Function to seed initial data
export const seedInitialData = async () => {
  // Check if connected to MongoDB
  if (mongoose.connection.readyState !== 1) {
    console.log('Not connected to MongoDB. Skipping data seeding.');
    return;
  }
  
  try {
    // Create admin user
    await createAdminUser();
    
    // Additional seeding functions can be added here
    
    console.log('Data seeding completed');
  } catch (error) {
    console.error('Data seeding failed:', error);
  }
};

// Run the seeding
const seedData = async () => {
  try {
    await connectToDB();
    const categories = await seedCategories();
    await seedProducts(categories);
    
    console.log('Data seeding completed successfully');
  } catch (error) {
    console.error('Data seeding failed:', error);
  }
};

// Only run seedData() if this file is run directly
// Don't run it when imported by another file
if (require.main === module) {
  seedData();
} 