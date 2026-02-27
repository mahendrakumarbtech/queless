const mongoose = require('mongoose');
const config = require('../config/config');
const seedSampleData = require('./sampleDataSeeder');

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');
    await seedSampleData(true);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
