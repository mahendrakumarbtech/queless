const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  shifts: [{
    name: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }]
});

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  providerType: {
    type: String,
    enum: ['doctor', 'ration_shop', 'bank', 'ca', 'aadhaar_center', 'school_college', 'library'],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  phone: String,
  email: String,
  schedule: [shiftSchema],
  settings: {
    allowOnlineBooking: {
      type: Boolean,
      default: true
    },
    advanceBookingDays: {
      type: Number,
      default: 7
    },
    paymentRequired: {
      type: Boolean,
      default: true
    },
    estimatedTimePerCustomer: {
      type: Number,
      default: 10 // in minutes
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Provider', providerSchema);
