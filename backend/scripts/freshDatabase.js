/**
 * Fresh database: drop current DB and run all seeders.
 * Usage: node scripts/freshDatabase.js   OR   npm run db:fresh
 */
const mongoose = require('mongoose');
const config = require('../config/config');

const seedPermissions = require('../seeders/permissionSeeder');
const seedRoles = require('../seeders/roleSeeder');
const seedAdmin = require('../seeders/adminSeeder');
const seedSettings = require('../seeders/settingsSeeder');

const runFresh = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected\n');

    const dbName = mongoose.connection.db.databaseName;
    console.log(`🗑️  Dropping database: ${dbName}`);
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database dropped\n');

    console.log('🌱 Seeding fresh data...\n');

    console.log('🔐 Seeding Permissions...');
    await seedPermissions();
    console.log('');

    console.log('👥 Seeding Roles...');
    await seedRoles();
    console.log('');

    console.log('📦 Seeding Admin User...');
    await seedAdmin();
    console.log('');

    console.log('⚙️  Seeding Default Settings...');
    await seedSettings();
    console.log('');

    console.log('✅ Fresh database ready!');
    console.log('\n📝 Login: admin@queless.com / admin123');
    console.log('   ⚠️  Change password after first login.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

runFresh();
