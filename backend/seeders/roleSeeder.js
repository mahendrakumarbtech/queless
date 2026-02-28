const Role = require('../models/Role');
const User = require('../models/User');
const ModelHasRole = require('../models/ModelHasRole');
const { getPermissionNamesForRole, syncRolePermissions } = require('../helpers/rolePermissions');

const GUARD_NAME = 'admin'; // Spatie-style guard

// All 5 default permission types per module (from Permission table)
const allPermissionNames = () => {
  const modules = ['users', 'providers', 'queues', 'settings', 'roles', 'admin'];
  const types = ['show', 'create', 'edit', 'delete', 'change_status'];
  return modules.flatMap((m) => types.map((t) => `${m}.${t}`));
};

const defaultRoles = [
  {
    name: 'admin',
    guard_name: GUARD_NAME,
    displayName: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: allPermissionNames(),
    isSystem: true,
    isActive: true
  },
  {
    name: 'staff',
    guard_name: GUARD_NAME,
    displayName: 'Staff Member',
    description: 'Can manage queues for assigned provider',
    permissions: ['queues.show', 'queues.create', 'queues.edit', 'queues.delete', 'queues.change_status'],
    isSystem: true,
    isActive: true
  },
  {
    name: 'provider',
    guard_name: GUARD_NAME,
    displayName: 'Service Provider',
    description: 'Can manage their own provider account and queues',
    permissions: [
      'providers.show', 'providers.create', 'providers.edit', 'providers.delete', 'providers.change_status',
      'queues.show', 'queues.create', 'queues.edit', 'queues.delete', 'queues.change_status',
      'settings.show', 'settings.edit'
    ],
    isSystem: true,
    isActive: true
  },
  {
    name: 'provider_staff',
    guard_name: GUARD_NAME,
    displayName: 'Provider Staff',
    description: 'Staff under a provider, can manage queues for that provider',
    permissions: ['queues.show', 'queues.create', 'queues.edit', 'queues.delete', 'queues.change_status'],
    isSystem: true,
    isActive: true
  },
  {
    name: 'customer',
    guard_name: GUARD_NAME,
    displayName: 'Customer',
    description: 'Can book and view their own queues',
    permissions: ['queues.show'],
    isSystem: true,
    isActive: true
  }
];

const seedRoles = async (closeConnection = false) => {
  try {
    let createdCount = 0;
    let updatedCount = 0;

    // Spatie: migrate existing roles to have guard_name
    await Role.updateMany(
      { guard_name: { $exists: false } },
      { $set: { guard_name: GUARD_NAME } }
    );

    for (const roleData of defaultRoles) {
      const { permissions: permNames, ...roleFields } = roleData;
      const existing = await Role.findOne({ name: roleData.name, guard_name: GUARD_NAME });

      if (existing) {
        const currentPerms = await getPermissionNamesForRole(existing._id);
        const permsEqual =
          JSON.stringify([...currentPerms].sort()) === JSON.stringify([...permNames].sort());
        const needsUpdate =
          !permsEqual ||
          existing.displayName !== roleData.displayName ||
          existing.description !== roleData.description;

        if (needsUpdate) {
          await Role.findOneAndUpdate(
            { name: roleData.name, guard_name: GUARD_NAME },
            {
              displayName: roleData.displayName,
              description: roleData.description,
              isActive: roleData.isActive,
              updatedAt: new Date()
            }
          );
          await syncRolePermissions(existing._id, permNames, GUARD_NAME);
          updatedCount++;
        }
      } else {
        const role = await Role.create(roleFields);
        await syncRolePermissions(role._id, permNames, GUARD_NAME);
        createdCount++;
      }
    }

    // Spatie: backfill model_has_roles for existing users (User.role -> model_has_roles)
    const usersWithRole = await User.find({ role: { $exists: true, $ne: null } }).select('_id role');
    for (const u of usersWithRole) {
      await ModelHasRole.findOneAndUpdate(
        { modelType: 'User', modelId: u._id },
        { roleId: u.role },
        { upsert: true }
      );
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
