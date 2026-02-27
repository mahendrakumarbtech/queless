const express = require('express');
const router = express.Router();
const {
  bookNumber,
  getCurrentNumber,
  getMyQueues,
  getProviders
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');

router.post('/book', protect, bookNumber);
router.get('/current/:providerId', getCurrentNumber);
router.get('/my-queues', protect, getMyQueues);
router.get('/providers', getProviders);

module.exports = router;
