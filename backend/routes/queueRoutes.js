const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const { protect } = require('../middleware/auth');

// @desc    Complete a queue
// @route   PUT /api/queue/:id/complete
// @access  Private (Provider/Staff)
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    queue.status = 'completed';
    queue.completedAt = new Date();
    await queue.save();

    res.json({
      success: true,
      data: queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
