const mongoose = require('mongoose');
const config = require('../config/config');
const seedPermissions = require('./permissionSeeder');
const seedRoles = require('./roleSeeder');

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');
    console.log('🔐 Seeding Permissions...');
    await seedPermissions();
    console.log('');
    console.log('👥 Seeding Roles...');
    await seedRoles(true);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
