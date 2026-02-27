const Role = require('../models/Role');

const defaultRoles = [
  {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      'users.read',
      'users.write',
      'users.delete',
      'providers.read',
      'providers.write',
      'providers.delete',
      'queues.read',
      'queues.write',
      'queues.delete',
      'settings.read',
      'settings.write',
      'roles.read',
      'roles.write',
      'admin.access'
    ],
    isSystem: true,
    isActive: true
  },
  {
    name: 'staff',
    displayName: 'Staff Member',
    description: 'Can manage queues for assigned provider',
    permissions: [
      'queues.read',
      'queues.write'
    ],
    isSystem: true,
    isActive: true
  },
  {
    name: 'provider',
    displayName: 'Service Provider',
    description: 'Can manage their own provider account and queues',
    permissions: [
      'providers.read',
      'providers.write',
      'queues.read',
      'queues.write',
      'settings.read'
    ],
    isSystem: true,
    isActive: true
  },
  {
    name: 'provider_staff',
    displayName: 'Provider Staff',
    description: 'Staff under a provider, can manage queues for that provider',
    permissions: [
      'queues.read',
      'queues.write'
    ],
    isSystem: true,
    isActive: true
  },
  {
    name: 'customer',
    displayName: 'Customer',
    description: 'Can book and view their own queues',
    permissions: [
      'queues.read',
      'queues.write'
    ],
    isSystem: true,
    isActive: true
  }
];

const seedRoles = async (closeConnection = false) => {
  try {
    let createdCount = 0;
    let updatedCount = 0;

    for (const roleData of defaultRoles) {
      const existing = await Role.findOne({ name: roleData.name });
      
      if (existing) {
        // Update if permissions or other fields changed
        const needsUpdate = 
          JSON.stringify(existing.permissions.sort()) !== JSON.stringify(roleData.permissions.sort()) ||
          existing.displayName !== roleData.displayName ||
          existing.description !== roleData.description;

        if (needsUpdate) {
          await Role.findOneAndUpdate(
            { name: roleData.name },
            {
              displayName: roleData.displayName,
              description: roleData.description,
              permissions: roleData.permissions,
              isActive: roleData.isActive,
              updatedAt: new Date()
            }
          );
          updatedCount++;
        }
      } else {
        await Role.create(roleData);
        createdCount++;
      }
    }

    console.log(`✅ Roles seeded: ${createdCount} created, ${updatedCount} updated`);
    
    if (closeConnection) {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('❌ Error seeding roles:', error.message);
    if (closeConnection) {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
    }
    throw error;
  }
};

module.exports = seedRoles;
