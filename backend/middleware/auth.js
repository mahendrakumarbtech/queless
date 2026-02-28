const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { getPermissionNamesForRole } = require('../helpers/rolePermissions');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = await User.findById(decoded.id)
        .select('-password')
        .populate('role', 'name displayName guard_name');

      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: 'User not found or inactive' });
      }

      // Ensure role is populated
      if (!req.user.role || !req.user.role.name) {
        return res.status(401).json({ message: 'User role not found' });
      }

      // Spatie: permissions come from role_has_permissions table
      req.user.role.permissions = await getPermissionNamesForRole(req.user.role._id);

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const userRoleName = req.user.role?.name;
    
    if (!userRoleName || !roles.includes(userRoleName)) {
      return res.status(403).json({
        message: `User role '${userRoleName || 'unknown'}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Permission-based authorization
exports.hasPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user.role || !req.user.role.permissions) {
      return res.status(403).json({
        message: 'User role does not have permissions defined'
      });
    }

    const userPermissions = req.user.role.permissions;
    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: 'User does not have required permissions'
      });
    }

    next();
  };
};
