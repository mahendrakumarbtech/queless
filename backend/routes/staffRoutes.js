const express = require('express');
const router = express.Router();
const {
  assignNumber,
  getCurrentShift,
  reinsertQueue
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

router.post('/assign', protect, authorize('staff', 'admin'), assignNumber);
router.get('/current-shift', protect, authorize('staff', 'admin'), getCurrentShift);
router.put('/reinsert/:queueId', protect, authorize('staff', 'admin'), reinsertQueue);

module.exports = router;
