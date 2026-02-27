/**
 * Permission modules for Role & Permission UI (Spatie-style).
 * Grouped by resource for checkboxes with "Select All" per module.
 */
module.exports = [
  {
    name: 'Users',
    slug: 'users',
    permissions: [
      { key: 'users.read', label: 'Users Show' },
      { key: 'users.write', label: 'Users Create / Edit' },
      { key: 'users.delete', label: 'Users Delete' }
    ]
  },
  {
    name: 'Providers',
    slug: 'providers',
    permissions: [
      { key: 'providers.read', label: 'Providers Show' },
      { key: 'providers.write', label: 'Providers Create / Edit' },
      { key: 'providers.delete', label: 'Providers Delete' }
    ]
  },
  {
    name: 'Queues',
    slug: 'queues',
    permissions: [
      { key: 'queues.read', label: 'Queues Show' },
      { key: 'queues.write', label: 'Queues Create / Edit' },
      { key: 'queues.delete', label: 'Queues Delete' }
    ]
  },
  {
    name: 'Settings',
    slug: 'settings',
    permissions: [
      { key: 'settings.read', label: 'Settings Show' },
      { key: 'settings.write', label: 'Settings Create / Edit' }
    ]
  },
  {
    name: 'Roles',
    slug: 'roles',
    permissions: [
      { key: 'roles.read', label: 'Roles Show' },
      { key: 'roles.write', label: 'Roles Create / Edit' }
    ]
  },
  {
    name: 'Admin',
    slug: 'admin',
    permissions: [
      { key: 'admin.access', label: 'Admin Panel Access' }
    ]
  }
];
