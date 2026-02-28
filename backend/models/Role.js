const mongoose = require('mongoose');

/**
 * Role model – Spatie-style.
 * role_has_permissions: permissions array stores permission names (sync from Permission table).
 */
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  guard_name: {
    type: String,
    required: true,
    default: 'admin',
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  // Permissions come from role_has_permissions table (RolePermission), not stored here
  isActive: {
    type: Boolean,
    default: true
  },
  isSystem: {
    type: Boolean,
    default: false // System roles cannot be deleted
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
roleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
roleSchema.index({ name: 1, guard_name: 1 }, { unique: true });
roleSchema.index({ isActive: 1 });

module.exports = mongoose.model('Role', roleSchema);
