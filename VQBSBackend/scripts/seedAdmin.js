require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin'); // Update the path if the Admin model is in a different location

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@vqbs.com' });
    if (existingAdmin) {
      console.log('Admin already exists, skipping seeding');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10); // Replace 'admin123' with a secure password

    // Create a new admin
    const admin = new Admin({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@vqbs.com', // Replace with your desired email
      password: hashedPassword,
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

// Run the seed script
seedAdmin();
