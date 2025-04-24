import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Menu, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { markAllAsRead } from '../redux/slices/notificationSlice';
import { logout } from "../redux/slices/authSlice";
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const { notifications } = useSelector((state) => state.notifications);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logout());
  };
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(markAllAsRead()); // Mark as read when opening
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
         CMC
        </Link>

        <div className="flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-blue-600">
            Cart
          </Link>
          <Link to="/wishlist" className="text-gray-600 hover:text-blue-600">
            Wishlist
          </Link>

          {userInfo ? (
            <>
          <Link to="/profile" className="text-gray-600 hover:text-blue-600">
            Profile
          </Link>
          <Link to="/orders" className="text-gray-600 hover:text-blue-600">
                Orders
              </Link>
           
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
               {/* Bell Icon */}
          <div className="relative">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneIcon
                className="text-gray-600 hover:text-blue-600 cursor-pointer"
                onClick={handleOpen}
                fontSize="large"
              />
            </Badge>

            {/* Notifications Dropdown */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {notifications.length === 0 ? (
                <MenuItem>No new notifications</MenuItem>
              ) : (
                notifications.map((n, index) => (
                  <MenuItem key={index}>{n.message}</MenuItem>
                ))
              )}
            <MenuItem> <Link to="/notifications" className="text-blue-600 hover:underline"> See All Notifications </Link> </MenuItem>
            </Menu>
          </div>
          </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:text-blue-600"
              >
                Register
              </Link>
          </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
