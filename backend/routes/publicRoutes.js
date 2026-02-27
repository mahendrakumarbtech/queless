const express = require('express');
const router = express.Router();
const { getPublicSettings } = require('../controllers/adminController');

router.get('/settings/public', getPublicSettings);

module.exports = router;
