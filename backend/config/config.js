// Backend Configuration
// Note: dotenv should be loaded in server.js before this file is required
// But we'll load it here as a fallback if not already loaded
if (!process.env.JWT_SECRET) {
  require('dotenv').config();
}

// Get JWT_SECRET from environment
const jwtSecret = process.env.JWT_SECRET;

// Validate JWT_SECRET - must exist and not be empty
if (!jwtSecret || typeof jwtSecret !== 'string' || jwtSecret.trim() === '') {
  console.error('❌ ERROR: JWT_SECRET is not properly configured!');
  console.error('   Please set JWT_SECRET in .env file');
  console.error('   Current value:', jwtSecret === undefined ? 'undefined' : `"${jwtSecret}"`);
  throw new Error('JWT_SECRET must be set in .env file');
}

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: jwtSecret.trim(), // Ensure no leading/trailing spaces
  JWT_EXPIRE: process.env.JWT_EXPIRE,

  // Settings image upload (favicon, logos)
  IMAGE_UPLOAD_ALLOWED_MIMES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  IMAGE_UPLOAD_MAX_SIZE_BYTES: parseInt(process.env.IMAGE_UPLOAD_MAX_SIZE_BYTES, 10) || 5 * 1024 * 1024, // 5MB default
};

// Log configuration on startup (without showing full secret)
if (process.env.NODE_ENV !== 'production') {
  console.log('✅ Configuration loaded:');
  console.log('   PORT:', config.PORT);
  console.log('   MONGODB_URI:', config.MONGODB_URI);
  console.log('   JWT_SECRET:', config.JWT_SECRET ? '✓ Set (' + config.JWT_SECRET.length + ' chars)' : '✗ Not set');
  console.log('   JWT_EXPIRE:', config.JWT_EXPIRE);
}

module.exports = config;
