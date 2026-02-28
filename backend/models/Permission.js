const mongoose = require('mongoose');

/**
 * Spatie: permissions table – same columns as Laravel
 * Only: name, guard_name, created_at, updated_at (id = _id)
 */
const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  guard_name: {
    type: String,
    required: true,
    default: 'admin',
    trim: true
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

permissionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

permissionSchema.index({ name: 1, guard_name: 1 }, { unique: true });
permissionSchema.index({ guard_name: 1 });

module.exports = mongoose.model('Permission', permissionSchema);
