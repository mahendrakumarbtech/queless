const express = require('express');
const router = express.Router();
const {
  createProvider,
  getProvider,
  updateSchedule,
  getCustomers,
  callNext,
  getCurrent
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('provider', 'admin'), createProvider);
router.get('/:id', protect, getProvider);
router.put('/:id/schedule', protect, authorize('provider', 'admin'), updateSchedule);
router.get('/:id/customers', protect, authorize('provider', 'staff', 'admin'), getCustomers);
router.post('/:id/next', protect, authorize('provider', 'staff', 'admin'), callNext);
router.get('/:id/current', protect, authorize('provider', 'staff', 'admin'), getCurrent);

module.exports = router;
