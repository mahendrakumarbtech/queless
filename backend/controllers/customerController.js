const Queue = require('../models/Queue');
const Provider = require('../models/Provider');
const moment = require('moment');

// @desc    Book a queue number
// @route   POST /api/customer/book
// @access  Private (Customer)
exports.bookNumber = async (req, res) => {
  try {
    const { providerId, shiftId, date, paymentAmount, paymentId } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const bookingDate = moment(date).startOf('day');
    const endOfDay = moment(bookingDate).endOf('day');

    // Get the last queue number for this provider, shift, and date
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
      customerId: req.user.id,
      queueNumber: nextQueueNumber,
      shiftId,
      date: bookingDate.toDate(),
      paymentStatus: paymentAmount > 0 ? 'completed' : 'pending',
      paymentAmount: paymentAmount || 0,
      paymentId,
      estimatedWaitTime
    });

    const queueWithProvider = await Queue.findById(queue._id)
      .populate('providerId', 'name providerType')
      .populate('customerId', 'name email phone');

    res.status(201).json({
      success: true,
      data: queueWithProvider
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current number for provider
// @route   GET /api/customer/current/:providerId
// @access  Public
exports.getCurrentNumber = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { shiftId, date } = req.query;

    const today = date ? moment(date).startOf('day') : moment().startOf('day');
    const endOfDay = moment(today).endOf('day');

    const currentQueue = await Queue.findOne({
      providerId,
      shiftId,
      date: { $gte: today.toDate(), $lte: endOfDay.toDate() },
      status: 'current'
    }).populate('providerId', 'name');

    res.json({
      success: true,
      data: currentQueue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get customer's queue status
// @route   GET /api/customer/my-queues
// @access  Private (Customer)
exports.getMyQueues = async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = { customerId: req.user.id };

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = moment(date).startOf('day');
      const endDate = moment(date).endOf('day');
      query.date = { $gte: startDate, $lte: endDate };
    }

    const queues = await Queue.find(query)
      .populate('providerId', 'name providerType address')
      .sort({ createdAt: -1 });

    // Calculate estimated wait time for waiting queues
    for (let queue of queues) {
      if (queue.status === 'waiting') {
        const waitingCount = await Queue.countDocuments({
          providerId: queue.providerId._id,
          shiftId: queue.shiftId,
          date: {
            $gte: moment(queue.date).startOf('day').toDate(),
            $lte: moment(queue.date).endOf('day').toDate()
          },
          queueNumber: { $lt: queue.queueNumber },
          status: { $in: ['waiting', 'current'] }
        });

        const provider = await Provider.findById(queue.providerId._id);
        queue.estimatedWaitTime = waitingCount * (provider?.settings?.estimatedTimePerCustomer || 10);
      }
    }

    res.json({
      success: true,
      data: queues
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all providers
// @route   GET /api/customer/providers
// @access  Public
exports.getProviders = async (req, res) => {
  try {
    const { providerType } = req.query;
    const query = { isActive: true };

    if (providerType) {
      query.providerType = providerType;
    }

    const providers = await Provider.find(query)
      .populate('owner', 'name email phone')
      .select('-schedule');

    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
