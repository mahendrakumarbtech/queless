const mongoose = require('mongoose');
const config = require('../config/config');

const seedRoles = require('./roleSeeder');
const seedAdmin = require('./adminSeeder');
const seedSettings = require('./settingsSeeder');
const seedSampleData = require('./sampleDataSeeder');

const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Run seeders
    console.log('👥 Seeding Roles...');
    await seedRoles();
    console.log('');

    console.log('📦 Seeding Admin User...');
    await seedAdmin();
    console.log('');

    console.log('⚙️  Seeding Default Settings...');
    await seedSettings();
    console.log('');

    // Uncomment the line below if you want to seed sample data
    // console.log('📊 Seeding Sample Data...');
    // await seedSampleData();
    // console.log('');

    console.log('✅ All seeders completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: admin@queless.com / admin123');
    console.log('   ⚠️  Please change passwords after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = { runSeeders, seedAdmin, seedSettings, seedSampleData };
