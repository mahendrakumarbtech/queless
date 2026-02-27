const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUser,
  getProviders,
  getQueues,
  getSettings,
  updateSettings,
  getDashboard,
  uploadImage,
  getOptions,
} = require('../controllers/adminController');
const { uploadSettingsImage } = require('../middleware/upload');
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

// User routes
router.get('/users', getUsers);
router.put('/users/:id', updateUser);

// Provider routes
router.get('/providers', getProviders);

// Queue routes
router.get('/queues', getQueues);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/upload', uploadSettingsImage, uploadImage);
router.get('/options', getOptions);

// Role routes
router.get('/roles', getRoles);
router.get('/roles/:id', getRole);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

// Dashboard
router.get('/dashboard', getDashboard);

module.exports = router;
