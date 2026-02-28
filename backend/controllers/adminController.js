const User = require('../models/User');
const Provider = require('../models/Provider');
const Queue = require('../models/Queue');
const Settings = require('../models/Settings');
const Role = require('../models/Role');
const ModelHasRole = require('../models/ModelHasRole');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const query = {};

    if (role) {
      // Support both role name and role ID
      const roleDoc = await Role.findOne({
        $or: [{ name: role }, { _id: role }]
      });
      if (roleDoc) {
        query.role = roleDoc._id;
      }
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .populate('providerId')
      .populate('role', 'name displayName guard_name')
      .select('-password')
      .sort({ createdAt: -1 });

    // Normalize users - convert role object to role name string for frontend
    const normalizedUsers = users.map(user => {
      const userObj = user.toObject();
      return {
        ...userObj,
        role: userObj.role?.name || userObj.roleName || 'customer'
      };
    });

    res.json({
      success: true,
      count: normalizedUsers.length,
      data: normalizedUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password').populate('role', 'name displayName guard_name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Spatie: sync model_has_roles when role is updated
    if (req.body.role != null) {
      await ModelHasRole.findOneAndUpdate(
        { modelType: 'User', modelId: req.params.id },
        { roleId: req.body.role },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all providers
// @route   GET /api/admin/providers
// @access  Private (Admin)
exports.getProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all queues
// @route   GET /api/admin/queues
// @access  Private (Admin)
exports.getQueues = async (req, res) => {
  try {
    const { providerId, status, date } = req.query;
    const query = {};

    if (providerId) query.providerId = providerId;
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const queues = await Queue.find(query)
      .populate('providerId', 'name providerType')
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: queues.length,
      data: queues
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get public settings (no auth) – website name, logos, favicon
// @route   GET /api/settings/public
// @access  Public
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.find().sort({ key: 1 });
    const all = {};
    settings.forEach(s => { all[s.key] = s.value; });
    const data = {
      website_name: all.website_name,
      website_tagline: all.website_tagline,
      favicon_icon: all.favicon_icon,
      website_logo: all.website_logo != null ? all.website_logo : all.backend_logo,
      website_white_logo: all.website_white_logo != null ? all.website_white_logo : all.backend_white_logo,
    };
    Object.keys(data).forEach(k => { if (data[k] == null) delete data[k]; });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.find().sort({ key: 1 });
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await Settings.findOneAndUpdate(
        { key },
        {
          key,
          value,
          updatedAt: new Date(),
          updatedBy: req.user.id
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await Provider.countDocuments();
    const totalQueues = await Queue.countDocuments();
    const activeQueues = await Queue.countDocuments({ status: { $in: ['waiting', 'current'] } });
    const completedQueues = await Queue.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalQueues,
        activeQueues,
        completedQueues
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload settings image (favicon, logo, etc.)
// @route   POST /api/admin/upload
// @access  Private (Admin)
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const url = `/uploads/settings/${req.file.filename}`;
  res.json({ success: true, data: { url } });
};

// @desc    Get options for dropdowns (currency, timezone, etc.) – single common API
// @route   GET /api/admin/options?type=currency|timezone&q=search
// @access  Private (Admin)
const optionsConfig = require('../config/optionsConfig');

exports.getOptions = (req, res) => {
  try {
    const { type, q } = req.query;
    if (!type) {
      return res.status(400).json({ success: false, message: 'Missing type' });
    }
    const results = optionsConfig.getOptions(type, q || '');
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
