const Role = require('../models/Role');
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');
const { getPermissionNamesForRole, getPermissionsForRoles, syncRolePermissions } = require('../helpers/rolePermissions');
const { getPaginationParams, paginatedResponse, toCSV, sendCSV } = require('../helpers/listHelpers');

// @desc    Get permission modules from Permission table (for Role & Permission UI)
// @route   GET /api/admin/roles/permission-modules
// @access  Private (Admin)
// Derive module and label from permission name (e.g. users.show -> module users, label "Users Show")
function nameToModuleAndLabel(name) {
  const parts = name.split('.');
  const module = parts[0] || '';
  const action = parts[1] || '';
  const actionLabel = action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const moduleLabel = module.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { module, label: `${moduleLabel} ${actionLabel}`.trim() };
}

exports.getPermissionModules = async (req, res) => {
  try {
    const guard_name = req.query.guard_name || 'admin';
    const permissions = await Permission.find({ guard_name }).sort({ name: 1 });
    const byModule = {};
    const moduleLabels = { users: 'Users', providers: 'Providers', queues: 'Queues', settings: 'Settings', roles: 'Roles', admin: 'Admin' };
    permissions.forEach((p) => {
      const { module, label } = nameToModuleAndLabel(p.name);
      if (!byModule[module]) {
        byModule[module] = { name: moduleLabels[module] || module, slug: module, permissions: [] };
      }
      byModule[module].permissions.push({ key: p.name, label });
    });
    const data = Object.values(byModule);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all roles (with filter, pagination, export)
// @route   GET /api/admin/roles
// @access  Private (Admin)
exports.getRoles = async (req, res) => {
  try {
    const { isActive, guard_name, search, export: exportFormat } = req.query;
    const query = { guard_name: guard_name || 'admin' };

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (search && search.trim()) {
      const re = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { name: re },
        { displayName: re },
      ];
    }

    const total = await Role.countDocuments(query);

    if (exportFormat === 'csv') {
      const roles = await Role.find(query).sort({ name: 1 }).limit(5000).lean();
      const rows = roles.map((r) => ({
        name: r.name,
        displayName: r.displayName,
        isActive: r.isActive,
        isSystem: r.isSystem,
      }));
      const csv = toCSV(rows, [
        { key: 'name', label: 'Name' },
        { key: 'displayName', label: 'Display Name' },
        { key: 'isActive', label: 'Active' },
        { key: 'isSystem', label: 'System' },
      ]);
      return sendCSV(res, csv, 'roles.csv');
    }

    const { page, limit, skip } = getPaginationParams(req.query);
    const roles = await Role.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean();
    const roleIds = roles.map((r) => r._id);
    const permMap = await getPermissionsForRoles(roleIds);
    roles.forEach((r) => {
      r.permissions = permMap.get(r._id.toString()) || [];
    });

    res.json(paginatedResponse(roles, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single role (with permissions from role_has_permissions)
// @route   GET /api/admin/roles/:id
// @access  Private (Admin)
exports.getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).lean();

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.permissions = await getPermissionNamesForRole(role._id);
    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create role
// @route   POST /api/admin/roles
// @access  Private (Admin)
exports.createRole = async (req, res) => {
  try {
    const { name, displayName, description, permissions, isActive } = req.body;
    const roleName = (name || '').toLowerCase().trim();
    if (!roleName) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const guard_name = req.body.guard_name || 'admin';
    const existingRole = await Role.findOne({ name: roleName, guard_name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists for this guard' });
    }

    const role = await Role.create({
      name: roleName,
      guard_name,
      displayName: displayName || roleName,
      description: description || '',
      isActive: isActive !== false,
      isSystem: false
    });

    await syncRolePermissions(role._id, Array.isArray(permissions) ? permissions : [], guard_name);

    const data = role.toObject();
    data.permissions = await getPermissionNamesForRole(role._id);
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update role
// @route   PUT /api/admin/roles/:id
// @access  Private (Admin)
exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Prevent modification of system roles
    if (role.isSystem && req.body.name && req.body.name !== role.name) {
      return res.status(400).json({ 
        message: 'Cannot modify system role name' 
      });
    }

    const updateFields = {
      displayName: req.body.displayName !== undefined ? req.body.displayName : role.displayName,
      description: req.body.description !== undefined ? req.body.description : role.description,
      isActive: req.body.isActive !== undefined ? req.body.isActive : role.isActive,
      updatedAt: new Date()
    };
    if (req.body.name && !role.isSystem) {
      updateFields.name = req.body.name.toLowerCase().trim();
    }
    await Role.findByIdAndUpdate(req.params.id, updateFields, { runValidators: true });

    if (Array.isArray(req.body.permissions)) {
      await syncRolePermissions(role._id, req.body.permissions, role.guard_name || 'admin');
    }

    const updatedRole = await Role.findById(req.params.id).lean();
    updatedRole.permissions = await getPermissionNamesForRole(role._id);
    res.json({
      success: true,
      data: updatedRole
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete role
// @route   DELETE /api/admin/roles/:id
// @access  Private (Admin)
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Prevent deletion of system roles
    if (role.isSystem) {
      return res.status(400).json({ 
        message: 'Cannot delete system role' 
      });
    }

    // Check if any users are using this role
    const User = require('../models/User');
    const usersWithRole = await User.countDocuments({ role: role._id });
    
    if (usersWithRole > 0) {
      return res.status(400).json({ 
        message: `Cannot delete role. ${usersWithRole} user(s) are using this role.` 
      });
    }

    await RolePermission.deleteMany({ roleId: req.params.id });
    await Role.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
