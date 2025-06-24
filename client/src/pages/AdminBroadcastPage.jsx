import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { TextField, Button } from '@mui/material';

const AdminBroadcastPage = () => {
  const [message, setMessage] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/broadcast', { message });
      toast.success('Notification broadcasted successfully!');
      setMessage('');
    } catch (error) {
      console.error('Broadcast error:', error.message);
      toast.error('Failed to broadcast.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Broadcast Notification
      </h1>

      <form onSubmit={handleBroadcast} className="max-w-xl mx-auto space-y-6">
        <TextField
          label="Broadcast Message"
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full"
        >
          Send Broadcast
        </Button>
      </form>
    </div>
  );
};

export default AdminBroadcastPage;
