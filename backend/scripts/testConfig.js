// Test script to check if environment variables are loading correctly
require('dotenv').config();

console.log('Environment Variables Test:');
console.log('==========================');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set (' + process.env.JWT_SECRET.length + ' chars)' : '✗ Not set');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('');

// Try to require config
try {
  const config = require('../config/config');
  console.log('✅ Config loaded successfully!');
  console.log('Config values:');
  console.log('  PORT:', config.PORT);
  console.log('  MONGODB_URI:', config.MONGODB_URI);
  console.log('  JWT_SECRET:', config.JWT_SECRET ? '✓ Set' : '✗ Not set');
  console.log('  JWT_EXPIRE:', config.JWT_EXPIRE);
} catch (error) {
  console.error('❌ Error loading config:', error.message);
  process.exit(1);
}
