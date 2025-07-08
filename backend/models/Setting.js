const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    codEnabled: {
      type: Boolean,
      default: true, // Initially COD is allowed
    },
    jazzCashEnabled: {
      type: Boolean,
      default: true, // Initially JazzCash is allowed
    },
    easypaisaEnabled: {
      type: Boolean,
      default: true, // Initially Easypaisa is allowed
    },
    cardEnabled: {
      type: Boolean,
      default: true, // Initially Card payment is allowed
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
