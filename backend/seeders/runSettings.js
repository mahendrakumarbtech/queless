const mongoose = require('mongoose');
const config = require('../config/config');
const seedSettings = require('./settingsSeeder');

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');
    await seedSettings(true);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
