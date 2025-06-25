import { useState, useEffect } from 'react';
import { useSelector ,useDispatch } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-hot-toast";
import { updateSettings } from '../redux/slices/authSlice';

const UserSettingsPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [wantsEmailNotifications, setWantsEmailNotifications] = useState(true);
  const [wantsNotificationSound, setWantsNotificationSound] = useState(true);
  const [wantsPushNotifications, setWantsPushNotifications] = useState(true);

  useEffect(() => {
    if (userInfo) {
      setWantsEmailNotifications(userInfo.wantsEmailNotifications ?? true);
      setWantsNotificationSound(userInfo.wantsNotificationSound ?? true);
      setWantsPushNotifications(userInfo.wantsPushNotifications ?? true);
    }
  }, [userInfo]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/users/settings', { wantsEmailNotifications,wantsNotificationSound, wantsPushNotifications });
       dispatch(updateSettings({ wantsEmailNotifications,wantsNotificationSound, wantsPushNotifications })) 
       toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error.message);
       toast.error('Failed to update settings');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Account Settings
      </h1>
      <form
        onSubmit={handleSaveSettings}
        className="max-w-xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex items-center space-x-4">
          <label className="text-lg font-semibold text-gray-700">
            Email Notifications
          </label>
          <input
            type="checkbox"
            checked={wantsEmailNotifications}
            onChange={() =>
              setWantsEmailNotifications(!wantsEmailNotifications)
            }
            className="w-6 h-6"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-lg font-semibold text-gray-700">
            Push Notifications
          </label>
          <input
            type="checkbox"
            checked={wantsPushNotifications}
            onChange={() =>
              setWantsPushNotifications(!wantsPushNotifications)
            }
            className="w-6 h-6"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-lg font-semibold text-gray-700">
              Notifications Sound
          </label>
          <input
            type="checkbox"
            checked={wantsNotificationSound}
            onChange={() =>
              setWantsNotificationSound(!wantsNotificationSound)
            }
            className="w-6 h-6"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition w-full"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default UserSettingsPage;
