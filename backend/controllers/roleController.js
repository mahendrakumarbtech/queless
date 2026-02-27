const Role = require('../models/Role');
const permissionModules = require('../config/permissionModules');

// @desc    Get permission modules (for Role & Permission UI – Spatie-style grouped permissions)
// @route   GET /api/admin/roles/permission-modules
// @access  Private (Admin)
exports.getPermissionModules = async (req, res) => {
  try {
    res.json({
      success: true,
      data: permissionModules
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all roles
// @route   GET /api/admin/roles
// @access  Private (Admin)
exports.getRoles = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const roles = await Role.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single role
// @route   GET /api/admin/roles/:id
// @access  Private (Admin)
exports.getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

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

    const existingRole = await Role.findOne({ name: roleName });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = await Role.create({
      name: roleName,
      displayName: displayName || roleName,
      description: description || '',
      permissions: Array.isArray(permissions) ? permissions : [],
      isActive: isActive !== false,
      isSystem: false
    });

    res.status(201).json({
      success: true,
      data: role
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
      permissions: Array.isArray(req.body.permissions) ? req.body.permissions : role.permissions,
      updatedAt: new Date()
    };
    if (req.body.name && !role.isSystem) {
      updateFields.name = req.body.name.toLowerCase().trim();
    }
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

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

    await Role.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
