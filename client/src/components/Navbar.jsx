import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Menu, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { markAllAsRead } from '../redux/slices/notificationSlice';
import { logout } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu as BurgerMenu, X } from 'lucide-react';

const Navbar = () => {
  const { notifications } = useSelector((state) => state.notifications);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(markAllAsRead());
  };

  const handleClose = () => setAnchorEl(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          CMC
        </Link>

        {/* Hamburger - Mobile */}
        <button
          className="sm:hidden text-gray-700 transition-transform duration-200"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={26} /> : <BurgerMenu size={26} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden sm:flex space-x-6 items-center">
          {[
            { to: '/', label: 'Home' },
            { to: '/cart', label: 'Cart' },
            { to: '/wishlist', label: 'Wishlist' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}

          {userInfo ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition">
                Profile
              </Link>
              <Link to="/orders" className="text-gray-600 hover:text-blue-600 transition">
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition"
              >
                Logout
              </button>
              <div className="relative">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsNoneIcon
                    className="text-gray-600 hover:text-blue-600 cursor-pointer transition-transform duration-200 hover:scale-110"
                    onClick={handleOpen}
                    fontSize="large"
                  />
                </Badge>

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  {notifications.length === 0 ? (
                    <MenuItem>No new notifications</MenuItem>
                  ) : (
                    notifications.map((n, i) => (
                      <MenuItem key={i}>{n.message}</MenuItem>
                    ))
                  )}
                  <MenuItem>
                    <Link to="/notifications" className="text-blue-600 hover:underline">
                      See All Notifications
                    </Link>
                  </MenuItem>
                </Menu>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">
                Login
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-600 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown with Animation */}
      <div
        className={`sm:hidden bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } px-4 py-3 space-y-2`}
      >
        {[
          { to: '/', label: 'Home' },
          { to: '/cart', label: 'Cart' },
          { to: '/wishlist', label: 'Wishlist' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={toggleMenu}
            className="block text-gray-600 hover:text-blue-600 transition"
          >
            {item.label}
          </Link>
        ))}

        {userInfo ? (
          <>
            <Link to="/profile" className="block text-gray-600 hover:text-blue-600 transition" onClick={toggleMenu}>
              Profile
            </Link>
            <Link to="/orders" className="block text-gray-600 hover:text-blue-600 transition" onClick={toggleMenu}>
              Orders
            </Link>
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="block text-gray-600 hover:text-red-600 transition w-full text-left"
            >
              Logout
            </button>
            <Link
              to="/notifications"
              className="block text-blue-600 hover:underline transition"
              onClick={toggleMenu}
            >
              Notifications ({unreadCount})
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="block text-gray-600 hover:text-blue-600 transition" onClick={toggleMenu}>
              Login
            </Link>
            <Link to="/register" className="block text-gray-600 hover:text-blue-600 transition" onClick={toggleMenu}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
