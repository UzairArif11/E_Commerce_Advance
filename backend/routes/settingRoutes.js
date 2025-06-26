const express = require('express');
const { adminAuth } = require("../middlewares/authMiddleware");
const { getSettings, updateCodSetting } = require('../controllers/settingController');

const router = express.Router();

// Route to get current settings
router.get('/', getSettings);

// Route to update COD setting (protected & admin-only)
router.put('/cod', adminAuth, updateCodSetting);

module.exports = router;
