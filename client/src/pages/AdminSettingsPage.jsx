import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const AdminSettingsPage = () => {
 
  const [codEnabled, setCodEnabled] = useState(true);
  const [jazzCashEnabled, setJazzCashEnabled] = useState(true);
  const [easypaisaEnabled, setEasypaisaEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(true);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosInstance.get('/settings');
        setCodEnabled(data.codEnabled);
        setJazzCashEnabled(data.jazzCashEnabled);
        setEasypaisaEnabled(data.easypaisaEnabled);
        setCardEnabled(data.cardEnabled);
      } catch (error) {
        console.error('Error fetching settings:', error.message);
         toast.error('Failed to load settings.');
      }
    };

    fetchSettings();
  }, []);

  const updateSetting = async () => {
    try {
      await axiosInstance.put('/settings/cod',{
      codEnabled,
      jazzCashEnabled,
      easypaisaEnabled,
      cardEnabled,
    });
       toast.success('COD setting updated.');
    } catch (error) {
      console.error(error.message);
       toast.error('Failed to update setting.');
    }
  };

  return (
   <div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

  <div className="space-y-4 mb-6">
    <div className="flex items-center space-x-4">
      <label className="text-xl">Enable Cash On Delivery:</label>
      <input
        type="checkbox"
        checked={codEnabled}
        onChange={() => setCodEnabled(!codEnabled)}
        className="w-6 h-6"
      />
    </div>

    <div className="flex items-center space-x-4">
      <label className="text-xl">Enable JazzCash:</label>
      <input
        type="checkbox"
        checked={jazzCashEnabled}
        onChange={() => setJazzCashEnabled(!jazzCashEnabled)}
        className="w-6 h-6"
      />
    </div>

    <div className="flex items-center space-x-4">
      <label className="text-xl">Enable Easypaisa:</label>
      <input
        type="checkbox"
        checked={easypaisaEnabled}
        onChange={() => setEasypaisaEnabled(!easypaisaEnabled)}
        className="w-6 h-6"
      />
    </div>

    <div className="flex items-center space-x-4">
      <label className="text-xl">Enable Card Payment:</label>
      <input
        type="checkbox"
        checked={cardEnabled}
        onChange={() => setCardEnabled(!cardEnabled)}
        className="w-6 h-6"
      />
    </div>
  </div>

  <button
    onClick={updateSetting}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Save
  </button>
</div>

  );
};

export default AdminSettingsPage;
