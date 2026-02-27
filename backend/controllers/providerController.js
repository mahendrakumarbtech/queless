const Provider = require('../models/Provider');
const User = require('../models/User');
const Queue = require('../models/Queue');
const moment = require('moment');

// @desc    Create provider
// @route   POST /api/provider
// @access  Private (Provider/Admin)
exports.createProvider = async (req, res) => {
  try {
    const provider = await Provider.create({
      ...req.body,
      owner: req.user.id
    });

    // Update user with providerId
    await User.findByIdAndUpdate(req.user.id, { providerId: provider._id });

    res.status(201).json({
      success: true,
      data: provider
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get provider details
// @route   GET /api/provider/:id
// @access  Private
exports.getProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!provider) {
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

// @desc    Update provider schedule
// @route   PUT /api/provider/:id/schedule
// @access  Private (Provider)
exports.updateSchedule = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check ownership
    if (provider.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    provider.schedule = req.body.schedule;
    await provider.save();

    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get patient/customer details
// @route   GET /api/provider/:id/customers
// @access  Private (Provider/Staff)
exports.getCustomers = async (req, res) => {
  try {
    const { date, status } = req.query;
    const query = { providerId: req.params.id };

    if (date) {
      const startDate = moment(date).startOf('day');
      const endDate = moment(date).endOf('day');
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (status) {
      query.status = status;
    }

    const queues = await Queue.find(query)
      .populate('customerId', 'name email phone')
      .sort({ queueNumber: 1 });

    res.json({
      success: true,
      data: queues
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Call next number
// @route   POST /api/provider/:id/next
// @access  Private (Provider/Staff)
exports.callNext = async (req, res) => {
  try {
    const { shiftId, date } = req.body;
    const providerId = req.params.id;

    const today = date ? moment(date).startOf('day') : moment().startOf('day');
    const endOfDay = moment(today).endOf('day');

    // Find next waiting number
    const nextQueue = await Queue.findOne({
      providerId,
      shiftId,
      date: { $gte: today.toDate(), $lte: endOfDay.toDate() },
      status: 'waiting'
    }).sort({ queueNumber: 1 });

    if (!nextQueue) {
      return res.status(404).json({ message: 'No more customers in queue' });
    }

    // Update current status
    await Queue.updateMany(
      {
        providerId,
        shiftId,
        date: { $gte: today.toDate(), $lte: endOfDay.toDate() },
        status: 'current'
      },
      { status: 'waiting' }
    );

    // Set this as current
    nextQueue.status = 'current';
    nextQueue.calledAt = new Date();
    await nextQueue.save();

    const queueWithCustomer = await Queue.findById(nextQueue._id)
      .populate('customerId', 'name email phone');

    res.json({
      success: true,
      data: queueWithCustomer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current number
// @route   GET /api/provider/:id/current
// @access  Private (Provider/Staff)
exports.getCurrent = async (req, res) => {
  try {
    const { shiftId, date } = req.query;
    const providerId = req.params.id;

    const today = date ? moment(date).startOf('day') : moment().startOf('day');
    const endOfDay = moment(today).endOf('day');

    const currentQueue = await Queue.findOne({
      providerId,
      shiftId,
      date: { $gte: today.toDate(), $lte: endOfDay.toDate() },
      status: 'current'
    }).populate('customerId', 'name email phone');

    res.json({
      success: true,
      data: currentQueue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
