const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const ModelHasRole = require('../models/ModelHasRole');
const config = require('../config/config');
const { getPermissionNamesForRole } = require('../helpers/rolePermissions');

// Generate JWT Token
const generateToken = (id) => {
  if (!config.JWT_SECRET || config.JWT_SECRET.trim() === '') {
    throw new Error('JWT_SECRET is not configured. Please set JWT_SECRET in .env file.');
  }
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, providerType } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Find role by name (role can be role name string or role ID)
    let roleDoc;
    if (typeof role === 'string') {
      roleDoc = await Role.findOne({ name: role, isActive: true });
      if (!roleDoc) {
        return res.status(400).json({ message: `Invalid role: ${role}` });
      }
    } else {
      roleDoc = await Role.findById(role);
      if (!roleDoc) {
        return res.status(400).json({ message: 'Invalid role ID' });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: roleDoc._id,
      providerType: roleDoc.name === 'provider' ? providerType : null
    });

    // Spatie: model_has_roles – assign role to user
    await ModelHasRole.create({
      roleId: roleDoc._id,
      modelType: 'User',
      modelId: user._id
    });

    await user.populate('role', 'name displayName guard_name');
    user.role.permissions = await getPermissionNamesForRole(roleDoc._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        roleDetails: user.role,
        providerType: user.providerType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Populate role - handle case where role might not exist
    try {
      await user.populate('role', 'name displayName guard_name');
      user.role.permissions = await getPermissionNamesForRole(user.role._id);
    } catch (populateError) {
      console.error('Error populating role:', populateError);
    }

    // Check if role exists
    if (!user.role || !user.role.name) {
      console.error('User role issue:', {
        userId: user._id,
        roleId: user.role,
        roleExists: !!user.role,
        roleName: user.role?.name
      });
      return res.status(500).json({
        message: 'User role not found. Please run seeders: npm run seed:roles && npm run seed:admin'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        roleDetails: user.role,
        providerType: user.providerType,
        providerId: user.providerId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('providerId')
      .populate('role', 'name displayName guard_name');
    if (user.role) {
      user.role.permissions = await getPermissionNamesForRole(user.role._id);
    }
    // Ensure role exists
    if (!user.role || !user.role.name) {
      return res.status(500).json({ 
        message: 'User role not found. Please contact administrator.' 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.name, // Send role as string, not object
        roleDetails: user.role, // Optional: full role object if needed
        providerType: user.providerType,
        providerId: user.providerId,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
