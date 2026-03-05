const express = require('express');
const router = express.Router();
const { getPublicSettings, getProviderById } = require('../controllers/adminController');

router.get('/settings/public', getPublicSettings);
router.get('/providers/:id', getProviderById);

module.exports = router;
