// src/pages/NotificationsPage.jsx
import { useSelector, useDispatch } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import {
  CheckCircleOutline,
  RemoveCircleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import {
  markAllAsRead,
  clearAllNotifications,
  markNotificationAsRead,
} from "../redux/slices/notificationSlice";
import axiosInstance from "../utils/axiosInstance";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/notifications?page=${page}&limit=10`
      );
      if (data.notifications.length > 0) {
        setNotifications((prev) => [...prev, ...data.notifications]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false); // No more notifications
      }
    } catch (error) {
      console.error("Error loading notifications:", error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    if (filter === 'broadcast') return notification.type === 'broadcast';
    return true; // all
  });
  // const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.put(`/notifications/read/all`);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Error marking all notification as read:", error.message);
    }
  };
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      dispatch(markNotificationAsRead(notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
    }
  };

  const handleClearAll = async () => {
    try {
      await axiosInstance.delete("/notifications/clear");
      setNotifications([]);

      dispatch(clearAllNotifications());
    } catch (error) {
      console.error("Error clearing notifications:", error.message);
    }
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
          onClick={() => dispatch(handleClearAll())}
        >
          Clear All
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500">No notifications found.</div>
      ) : (
        <InfiniteScroll
          dataLength={notifications.length}
          next={fetchNotifications}
          hasMore={hasMore}
          loader={<h4 className="text-center">Loading more...</h4>}
          endMessage={
            <p className="text-center text-gray-500">No more notifications.</p>
          }
        >
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded ${
                filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded ${
                filter === "unread" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Unread
            </button>

            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded ${
                filter === "read" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setFilter("broadcast")}
              className={`px-4 py-2 rounded ${
                filter === "broadcast"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
             
              Broadcasts 
            </button>
          </div>

          <List>
            {filteredNotifications.map((notification) => (
              <ListItem
                key={notification._id}
                onClick={() => handleMarkAsRead(notification._id)}
                className="cursor-pointer"
                sx={{
                  backgroundColor: notification.read ? "white" : "#e3f2fd",
                  borderBottom: "1px solid #eee",
                  borderRadius: "8px",
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={notification.read ? "Read" : "Unread"}
                  primaryTypographyProps={{
                    fontWeight: notification.read ? "normal" : "bold",
                    color: notification.read ? "textSecondary" : "textPrimary",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default NotificationsPage;
