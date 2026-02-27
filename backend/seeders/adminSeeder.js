const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const config = require('../config/config');

const seedAdmin = async (closeConnection = false) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@queless.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Get admin role
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      throw new Error('Admin role not found. Please run role seeder first.');
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@queless.com',
      password: 'admin123', // Will be hashed by pre-save hook
      phone: '1234567890',
      role: adminRole._id,
      isActive: true
    });

    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@queless.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  Please change the password after first login!');
    
    if (closeConnection) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    if (closeConnection) {
      await mongoose.connection.close();
    }
    throw error;
  }
};

module.exports = seedAdmin;
