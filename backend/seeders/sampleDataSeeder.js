const mongoose = require('mongoose');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Role = require('../models/Role');

const seedSampleData = async (closeConnection = false) => {
  try {
    // Check if sample data already exists
    const existingProvider = await Provider.findOne({ name: 'Sample Doctor Clinic' });
    
    if (existingProvider) {
      console.log('✅ Sample data already exists');
      return;
    }

    // Get roles
    const providerRole = await Role.findOne({ name: 'provider' });
    const customerRole = await Role.findOne({ name: 'customer' });
    const staffRole = await Role.findOne({ name: 'staff' });

    if (!providerRole || !customerRole || !staffRole) {
      throw new Error('Roles not found. Please run role seeder first.');
    }

    // Create sample provider user
    const providerUser = await User.create({
      name: 'Dr. John Smith',
      email: 'doctor@queless.com',
      password: 'doctor123',
      phone: '9876543210',
      role: providerRole._id,
      providerType: 'doctor',
      isActive: true
    });

    // Create sample provider
    const provider = await Provider.create({
      name: 'Sample Doctor Clinic',
      providerType: 'doctor',
      owner: providerUser._id,
      address: {
        street: '123 Medical Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      phone: '9876543210',
      email: 'doctor@queless.com',
      schedule: [
        {
          day: 'monday',
          shifts: [
            { name: 'Morning', startTime: '09:00', endTime: '13:00', isActive: true },
            { name: 'Evening', startTime: '17:00', endTime: '21:00', isActive: true }
          ]
        },
        {
          day: 'tuesday',
          shifts: [
            { name: 'Morning', startTime: '09:00', endTime: '13:00', isActive: true },
            { name: 'Evening', startTime: '17:00', endTime: '21:00', isActive: true }
          ]
        },
        {
          day: 'wednesday',
          shifts: [
            { name: 'Morning', startTime: '09:00', endTime: '13:00', isActive: true },
            { name: 'Evening', startTime: '17:00', endTime: '21:00', isActive: true }
          ]
        },
        {
          day: 'thursday',
          shifts: [
            { name: 'Morning', startTime: '09:00', endTime: '13:00', isActive: true },
            { name: 'Evening', startTime: '17:00', endTime: '21:00', isActive: true }
          ]
        },
        {
          day: 'friday',
          shifts: [
            { name: 'Morning', startTime: '09:00', endTime: '13:00', isActive: true },
            { name: 'Evening', startTime: '17:00', endTime: '21:00', isActive: true }
          ]
        }
      ],
      settings: {
        allowOnlineBooking: true,
        advanceBookingDays: 7,
        paymentRequired: true,
        estimatedTimePerCustomer: 15
      },
      isActive: true
    });

    // Update provider user with providerId
    providerUser.providerId = provider._id;
    await providerUser.save();

    // Create sample customer
    await User.create({
      name: 'Sample Customer',
      email: 'customer@queless.com',
      password: 'customer123',
      phone: '9876543211',
      role: customerRole._id,
      isActive: true
    });

    // Create sample staff
    await User.create({
      name: 'Sample Staff',
      email: 'staff@queless.com',
      password: 'staff123',
      phone: '9876543212',
      role: staffRole._id,
      providerId: provider._id,
      isActive: true
    });

    console.log('✅ Sample data created successfully');
    console.log('   Provider: doctor@queless.com / doctor123');
    console.log('   Customer: customer@queless.com / customer123');
    console.log('   Staff: staff@queless.com / staff123');
    
    if (closeConnection) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('❌ Error seeding sample data:', error.message);
    if (closeConnection) {
      await mongoose.connection.close();
    }
    throw error;
  }
};

module.exports = seedSampleData;
