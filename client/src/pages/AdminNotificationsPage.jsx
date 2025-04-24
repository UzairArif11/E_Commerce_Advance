import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Typography } from '@mui/material';
 

const socket = io('http://localhost:5000'); // Backend URL

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen to real-time events
    socket.on('orderPlaced', (data) => {
      setNotifications((prev) => [{ type: 'placed', ...data }, ...prev]);
       toast.success(data.message);
    });

    socket.on('orderShipped', (data) => {
      setNotifications((prev) => [{ type: 'shipped', ...data }, ...prev]);
       toast.success(data.message);
    });

    socket.on('orderCancelled', (data) => {
      setNotifications((prev) => [{ type: 'cancelled', ...data }, ...prev]);
       toast.success(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Notifications (Live)</h1>

      <Timeline position="alternate">
        {notifications.map((notification, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={
                notification.type === 'placed' ? 'primary' :
                notification.type === 'shipped' ? 'info' :
                notification.type === 'cancelled' ? 'error' : 'grey'
              } />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="h6" component="span">
                {notification.message}
              </Typography>
              <Typography className="text-sm text-gray-400">
                Order ID: {notification.orderId.slice(0, 8)}...
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default AdminNotificationsPage;
