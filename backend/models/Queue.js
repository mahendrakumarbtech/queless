const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  queueNumber: {
    type: Number,
    required: true
  },
  shiftId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'current', 'completed', 'cancelled', 'reinserted'],
    default: 'waiting'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  paymentId: String,
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  calledAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  estimatedWaitTime: {
    type: Number, // in minutes
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
queueSchema.index({ providerId: 1, date: 1, status: 1 });
queueSchema.index({ customerId: 1, date: 1 });

module.exports = mongoose.model('Queue', queueSchema);
