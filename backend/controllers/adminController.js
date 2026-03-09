const User = require('../models/User');
const Provider = require('../models/Provider');
const Queue = require('../models/Queue');
const Settings = require('../models/Settings');
const Role = require('../models/Role');
const ModelHasRole = require('../models/ModelHasRole');
const { getPaginationParams, paginatedResponse, toCSV, sendCSV } = require('../helpers/listHelpers');

// @desc    Get all users (with filter, pagination, export)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { role, isActive, search, export: exportFormat } = req.query;
    const query = {};

    if (role) {
      const roleDoc = await Role.findOne({
        $or: [{ name: role }, { _id: role }]
      });
      if (roleDoc) {
        query.role = roleDoc._id;
      }
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search && search.trim()) {
      const re = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { name: re },
        { email: re },
      ];
    }

    const total = await User.countDocuments(query);
    let users;

    if (exportFormat === 'csv') {
      users = await User.find(query)
        .populate('role', 'name displayName')
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5000)
        .lean();
      const normalized = users.map((u) => ({
        ...u,
        role: u.role?.name || u.roleName || 'customer'
      }));
      const csv = toCSV(normalized, [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'isActive', label: 'Active' },
        { key: 'createdAt', label: 'Created At' },
      ]);
      return sendCSV(res, csv, 'users.csv');
    }

    const { page, limit, skip } = getPaginationParams(req.query);
    users = await User.find(query)
      .populate('providerId')
      .populate('role', 'name displayName guard_name')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const normalizedUsers = users.map(user => {
      const userObj = user.toObject();
      return {
        ...userObj,
        role: userObj.role?.name || userObj.roleName || 'customer'
      };
    });

    res.json(paginatedResponse(normalizedUsers, total, page, limit));
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

// @desc    Get all providers (with filter, pagination, export)
// @route   GET /api/admin/providers
// @access  Private (Admin)
exports.getProviders = async (req, res) => {
  try {
    const { search, isActive, export: exportFormat } = req.query;
    const query = {};

    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search && search.trim()) {
      const re = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { name: re },
        { providerType: re },
      ];
    }

    const total = await Provider.countDocuments(query);

    if (exportFormat === 'csv') {
      const providers = await Provider.find(query)
        .populate('owner', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(5000)
        .lean();
      const csv = toCSV(providers, [
        { key: 'name', label: 'Name' },
        { key: 'providerType', label: 'Type' },
        { key: 'isActive', label: 'Active' },
        { key: 'createdAt', label: 'Created At' },
      ]);
      return sendCSV(res, csv, 'providers.csv');
    }

    const { page, limit, skip } = getPaginationParams(req.query);
    const providers = await Provider.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(paginatedResponse(providers, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single provider (for public booking page)
// @route   GET /api/providers/:id
// @access  Public
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('owner', 'name email phone')
      .select('-__v');

    if (!provider || !provider.isActive) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all queues (with filter, pagination, export)
// @route   GET /api/admin/queues
// @access  Private (Admin)
exports.getQueues = async (req, res) => {
  try {
    const { providerId, status, date, search, export: exportFormat } = req.query;
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
    if (search && search.trim()) {
      const num = parseInt(search.trim(), 10);
      if (!isNaN(num)) {
        query.queueNumber = num;
      }
    }

    const total = await Queue.countDocuments(query);

    if (exportFormat === 'csv') {
      const queues = await Queue.find(query)
        .populate('providerId', 'name providerType')
        .populate('customerId', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(5000)
        .lean();
      const rows = queues.map((q) => ({
        queueNumber: q.queueNumber,
        customer: q.customerId?.name || '',
        provider: q.providerId?.name || '',
        date: q.date,
        status: q.status,
      }));
      const csv = toCSV(rows, [
        { key: 'queueNumber', label: 'Queue No' },
        { key: 'customer', label: 'Customer' },
        { key: 'provider', label: 'Provider' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
      ]);
      return sendCSV(res, csv, 'queues.csv');
    }

    const { page, limit, skip } = getPaginationParams(req.query);
    const queues = await Queue.find(query)
      .populate('providerId', 'name providerType')
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(paginatedResponse(queues, total, page, limit));
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
