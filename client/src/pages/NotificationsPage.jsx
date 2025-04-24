// src/pages/NotificationsPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import {
  CheckCircleOutline,
  RemoveCircleOutline,
  DeleteOutline,
} from '@mui/icons-material';
import { markAllAsRead ,clearAllNotifications} from '../redux/slices/notificationSlice';
 
const NotificationsPage = () => {
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleOutline />}
          onClick={handleMarkAllRead}
        >
          Mark All as Read
        </Button>
        <Button
  variant="contained"
  color="error"
  startIcon={<DeleteOutline />}
  onClick={() => dispatch(clearAllNotifications())}
>
  Clear All
</Button>

      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500">
          No notifications found.
        </div>
      ) : (
        <List>
          {notifications.map((notification, index) => (
            <ListItem
              key={index}
              sx={{
                backgroundColor: notification.read ? 'white' : '#e3f2fd',
                borderBottom: '1px solid #eee',
                borderRadius: '8px',
                mb: 1,
              }}
            >
              <ListItemText
                primary={notification.message}
                secondary={notification.read ? 'Read' : 'Unread'}
                primaryTypographyProps={{
                  fontWeight: notification.read ? 'normal' : 'bold',
                  color: notification.read ? 'textSecondary' : 'textPrimary',
                }}
              />
              <ListItemSecondaryAction>
                {notification.read ? (
                  <RemoveCircleOutline color="action" />
                ) : (
                  <CheckCircleOutline color="primary" />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default NotificationsPage;
