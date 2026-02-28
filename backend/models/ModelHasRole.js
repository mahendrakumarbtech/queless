const mongoose = require('mongoose');

/**
 * Spatie: model_has_roles table
 * Assigns roles to any model (User, etc.) – polymorphic
 * model_type = 'User', model_id = user._id
 */
const modelHasRoleSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  modelType: {
    type: String,
    required: true,
    trim: true
  },
  modelId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: false, collection: 'model_has_roles' });

modelHasRoleSchema.index({ modelType: 1, modelId: 1 });
modelHasRoleSchema.index({ roleId: 1 });

module.exports = mongoose.model('ModelHasRole', modelHasRoleSchema, 'model_has_roles');
