const Setting = require('../models/Setting');

// Get current settings or create default if none exist
const getSettings = async (req, res) => {
  const settings = await Setting.findOne();
  if (!settings) {
    const newSetting = await Setting.create({});
    return res.json(newSetting);
  }
  res.json(settings);
};

// Update COD (Cash on Delivery) setting
const updateCodSetting = async (req, res) => {
  const { codEnabled } = req.body;

  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({});
  }

  setting.codEnabled = codEnabled;
  await setting.save();

  res.json(setting);
};

module.exports = {
  getSettings,
  updateCodSetting,
};
