const mongoose = require('mongoose');
const config = require('../config/config');
const seedPermissions = require('./permissionSeeder');

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await seedPermissions(true);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
