const Queue = require('../models/Queue');
const Provider = require('../models/Provider');
const User = require('../models/User');
const moment = require('moment');

// @desc    Assign number to customer
// @route   POST /api/staff/assign
// @access  Private (Staff)
exports.assignNumber = async (req, res) => {
  try {
    const { providerId, customerId, shiftId, date, paymentAmount, paymentId } = req.body;

    // Verify staff belongs to this provider
    const user = await User.findById(req.user.id);
    if (user.providerId?.toString() !== providerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized for this provider' });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const bookingDate = moment(date).startOf('day');
    const endOfDay = moment(bookingDate).endOf('day');

    // Get the last queue number
    const lastQueue = await Queue.findOne({
      providerId,
      shiftId,
      date: { $gte: bookingDate.toDate(), $lte: endOfDay.toDate() }
    }).sort({ queueNumber: -1 });

    const nextQueueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;

    // Calculate estimated wait time
    const waitingCount = await Queue.countDocuments({
      providerId,
      shiftId,
      date: { $gte: bookingDate.toDate(), $lte: endOfDay.toDate() },
      status: { $in: ['waiting', 'current'] }
    });

    const estimatedWaitTime = waitingCount * (provider.settings.estimatedTimePerCustomer || 10);

    const queue = await Queue.create({
      providerId,
      customerId,
      queueNumber: nextQueueNumber,
      shiftId,
      date: bookingDate.toDate(),
      paymentStatus: paymentAmount > 0 ? 'completed' : 'pending',
      paymentAmount: paymentAmount || 0,
      paymentId,
      assignedBy: req.user.id,
      estimatedWaitTime
    });

    const queueWithDetails = await Queue.findById(queue._id)
      .populate('providerId', 'name providerType')
      .populate('customerId', 'name email phone')
      .populate('assignedBy', 'name');

    res.status(201).json({
      success: true,
      data: queueWithDetails
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current shift queue
// @route   GET /api/staff/current-shift
// @access  Private (Staff)
exports.getCurrentShift = async (req, res) => {
  try {
    const { providerId, shiftId, date } = req.query;

    // Verify staff belongs to this provider
    const user = await User.findById(req.user.id);
    if (user.providerId?.toString() !== providerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized for this provider' });
    }

    const today = date ? moment(date).startOf('day') : moment().startOf('day');
    const endOfDay = moment(today).endOf('day');

    const queues = await Queue.find({
      providerId,
      shiftId,
      date: { $gte: today.toDate(), $lte: endOfDay.toDate() },
      status: { $in: ['waiting', 'current'] }
    })
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

// @desc    Reinsert customer in queue
// @route   PUT /api/staff/reinsert/:queueId
// @access  Private (Staff)
exports.reinsertQueue = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { position } = req.body;

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Verify staff belongs to this provider
    const user = await User.findById(req.user.id);
    if (user.providerId?.toString() !== queue.providerId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (queue.status === 'completed') {
      // Reinsert completed customer
      const today = moment(queue.date).startOf('day');
      const endOfDay = moment(today).endOf('day');

      // Get last queue number
      const lastQueue = await Queue.findOne({
        providerId: queue.providerId,
        shiftId: queue.shiftId,
        date: { $gte: today.toDate(), $lte: endOfDay.toDate() }
      }).sort({ queueNumber: -1 });

      const newQueueNumber = lastQueue ? lastQueue.queueNumber + 1 : queue.queueNumber;

      queue.queueNumber = newQueueNumber;
      queue.status = 'waiting';
      queue.completedAt = null;
      queue.calledAt = null;
      queue.reinserted = true;
      await queue.save();

      const queueWithDetails = await Queue.findById(queue._id)
        .populate('customerId', 'name email phone')
        .populate('providerId', 'name');

      res.json({
        success: true,
        data: queueWithDetails
      });
    } else {
      return res.status(400).json({ message: 'Can only reinsert completed customers' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
