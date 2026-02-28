const Permission = require('../models/Permission');

const MODULES = [
  { slug: 'users', name: 'Users' },
  { slug: 'providers', name: 'Providers' },
  { slug: 'queues', name: 'Queues' },
  { slug: 'settings', name: 'Settings' },
  { slug: 'roles', name: 'Roles' },
  { slug: 'admin', name: 'Admin' }
];

const PERMISSION_TYPES = ['show', 'create', 'edit', 'delete', 'change_status'];

const GUARD_NAME = 'admin'; // Spatie-style guard (admin panel)

const seedPermissions = async (closeConnection = false) => {
  try {
    let createdCount = 0;

    // Spatie: ensure all existing permissions have guard_name (migration)
    await Permission.updateMany(
      { guard_name: { $exists: false } },
      { $set: { guard_name: GUARD_NAME } }
    );

    for (const mod of MODULES) {
      for (const type of PERMISSION_TYPES) {
        const name = `${mod.slug}.${type}`;
        const existing = await Permission.findOne({ name, guard_name: GUARD_NAME });

        if (!existing) {
          await Permission.create({ name, guard_name: GUARD_NAME });
          createdCount++;
        }
      }
    }

    console.log(`✅ Permissions seeded: ${createdCount} created`);

    if (closeConnection) {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('❌ Error seeding permissions:', error.message);
    if (closeConnection) {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
    }
    throw error;
  }
};

module.exports = seedPermissions;
