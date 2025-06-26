const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    codEnabled: {
      type: Boolean,
      default: true, // Initially COD is allowed
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
