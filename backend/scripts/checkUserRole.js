const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const config = require('../config/config');

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    const adminUser = await User.findOne({ email: 'admin@queless.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      console.log('   Run: npm run seed:admin\n');
      process.exit(1);
    }

    console.log('📋 Admin User Details:');
    console.log('   Email:', adminUser.email);
    console.log('   Name:', adminUser.name);
    console.log('   Role ID:', adminUser.role);
    console.log('   Is Active:', adminUser.isActive);

    if (!adminUser.role) {
      console.log('\n❌ Admin user has no role assigned!');
      console.log('   Run: npm run seed:roles first, then npm run seed:admin\n');
      process.exit(1);
    }

    // Check if role exists
    const role = await Role.findById(adminUser.role);
    if (!role) {
      console.log('\n❌ Role not found in database!');
      console.log('   Role ID:', adminUser.role);
      console.log('   Run: npm run seed:roles\n');
      process.exit(1);
    }

    console.log('\n✅ Role Details:');
    console.log('   Role Name:', role.name);
    console.log('   Display Name:', role.displayName);
    console.log('   Is Active:', role.isActive);

    // Test populate
    await adminUser.populate('role', 'name displayName permissions');
    console.log('\n✅ Role populated successfully');
    console.log('   Populated Role Name:', adminUser.role.name);

    await mongoose.connection.close();
    console.log('\n✅ All checks passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
