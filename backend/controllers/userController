const User = require( "../models/User");
const bcrypt = require( "bcryptjs");

const updateUser = async (req, res) => {

  const { name, email, password } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Update fields if present
    if (name) user.name = name;
    if (email) user.email = email;

    // 3. Hash password only if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 4. Save and respond
    await user.save();
    res.json({ msg: "User updated successfully", user });

  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
const updateUserSettings = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    
    user.wantsEmailNotifications = req.body.wantsEmailNotifications ?? user.wantsEmailNotifications;
    user.wantsNotificationSound = req.body.wantsNotificationSound ?? user.wantsNotificationSound;
    user.wantsPushNotifications = req.body.wantsPushNotifications ?? user.wantsPushNotifications;

    await user.save();

    res.json({
      message: 'Settings updated',
      wantsEmailNotifications: user.wantsEmailNotifications,
      wantsNotificationSound: user.wantsNotificationSound,
      wantsPushNotifications: user.wantsPushNotifications,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  updateUser,
  updateUserSettings
};

