const mongoose = require('mongoose');

/**
 * Spatie: role_has_permissions table
 * Pivot between roles and permissions (many-to-many)
 */
const rolePermissionSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    required: true
  }
}, { timestamps: false, collection: 'role_has_permissions' });

rolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });
rolePermissionSchema.index({ roleId: 1 });
rolePermissionSchema.index({ permissionId: 1 });

module.exports = mongoose.model('RolePermission', rolePermissionSchema, 'role_has_permissions');
