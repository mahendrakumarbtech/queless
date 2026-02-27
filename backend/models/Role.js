const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    enum: ['admin', 'provider', 'staff', 'customer']
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  permissions: [{
    type: String,
    enum: [
      'users.read',
      'users.write',
      'users.delete',
      'providers.read',
      'providers.write',
      'providers.delete',
      'queues.read',
      'queues.write',
      'queues.delete',
      'settings.read',
      'settings.write',
      'admin.access'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isSystem: {
    type: Boolean,
    default: false // System roles cannot be deleted
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
roleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });

module.exports = mongoose.model('Role', roleSchema);
