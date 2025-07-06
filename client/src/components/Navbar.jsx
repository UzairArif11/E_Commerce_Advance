import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import { Badge, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { markAllAsRead } from '../redux/slices/notificationSlice';
import { logout } from '../redux/slices/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu as BurgerMenu, X, Search, ChevronDown } from 'lucide-react';
import { persistor } from '../redux/store';

const Navbar = () => {
  const { notifications } = useSelector((state) => state.notifications);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const isAdmin = userInfo?.user?.role === 'admin';

  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuAnchor);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    setUserMenuAnchor(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNotificationOpen = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(markAllAsRead());
  };

  const handleNotificationClose = () => setAnchorEl(null);
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = isAdmin ? [
    { to: '/admin/dashboard', label: 'Dashboard', icon: null },
    { to: '/admin/products', label: 'Products', icon: null },
    { to: '/admin/orders', label: 'Orders', icon: null },
    { to: '/admin/users', label: 'Users', icon: null },
    { to: '/admin/analytics', label: 'Analytics', icon: null },
    { to: '/admin/categories', label: 'Categories', icon: null },
    { to: '/admin/reports', label: 'Reports', icon: null },
    { to: '/admin/inventory', label: 'Inventory', icon: null },
    { to: '/admin/broadcast', label: 'Broadcast', icon: null },
  ] : [
    { to: '/', label: 'Home', icon: null },
    { to: '/cart', label: 'Cart', icon: ShoppingCartIcon, count: cartItemsCount },
    { to: '/wishlist', label: 'Wishlist', icon: FavoriteIcon, count: wishlistCount },
  ];

  const userMenuItems = userInfo ? (
    isAdmin ? [
      { to: '/admin/profile', label: 'Admin Profile', icon: PersonIcon },
      { to: '/admin/setting', label: 'Admin Settings', icon: null },
      { to: '/settings', label: 'Settings', icon: null },
      { to: '/admin/notifications', label: 'Notifications', icon: null },
    ] : [
      { to: '/profile', label: 'My Profile', icon: PersonIcon },
      { to: '/orders', label: 'My Orders', icon: null },
      { to: '/settings', label: 'Settings', icon: null },
    ]
  ) : [];

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-gray-800 hidden sm:block">
              CommerceMax
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile and for admin users */}
          {!isAdmin && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className={`relative w-full group ${
                searchFocused ? 'scale-105' : ''
              } transition-transform duration-200`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    searchFocused 
                      ? 'border-primary-500 shadow-lg ring-4 ring-primary-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  } focus:outline-none bg-gray-50 focus:bg-white`}
                />
              </form>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                
                return (
                  <Tooltip key={item.to} title={item.label} arrow>
                    <Link
                      to={item.to}
                      className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      {Icon && (
                        <Badge badgeContent={item.count || 0} color="error" 
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          invisible={!item.count}
                        >
                          <Icon className="w-5 h-5" />
                        </Badge>
                      )}
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
                      )}
                    </Link>
                  </Tooltip>
                );
              })}
            </div>

            {/* User Section */}
            {userInfo ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Tooltip title="Notifications" arrow>
                  <button
                    onClick={handleNotificationOpen}
                    className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <Badge badgeContent={unreadCount} color="error">
                      <NotificationsNoneIcon className="w-6 h-6" />
                    </Badge>
                  </button>
                </Tooltip>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={handleUserMenuOpen}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <Avatar 
                      src={userInfo.avatar} 
                      alt={userInfo.name}
                      className="w-8 h-8 ring-2 ring-transparent group-hover:ring-primary-200 transition-all duration-200"
                    >
                      {userInfo.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <span className="font-medium text-gray-700 hidden xl:block">
                      {userInfo.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  <Menu
                    anchorEl={userMenuAnchor}
                    open={userMenuOpen}
                    onClose={handleUserMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      className: 'mt-2 rounded-xl shadow-xl border border-gray-100 min-w-[200px]'
                    }}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{userInfo.name}</p>
                      <p className="text-sm text-gray-500">{userInfo.email}</p>
                    </div>
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <MenuItem key={item.to} onClick={handleUserMenuClose}>
                          <Link to={item.to} className="flex items-center space-x-3 w-full">
                            {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                            <span>{item.label}</span>
                          </Link>
                        </MenuItem>
                      );
                    })}
                    <div className="border-t border-gray-100">
                      <MenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                        <span>Sign Out</span>
                      </MenuItem>
                    </div>
                  </Menu>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn-ghost btn-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={toggleMenu}
          >
            {menuOpen ? <X size={24} /> : <BurgerMenu size={24} />}
          </button>
        </div>

        {/* Mobile Search - Visible when menu is open and user is not admin */}
        {menuOpen && !isAdmin && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[33rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-responsive py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={toggleMenu}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          {userInfo ? (
            <>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center space-x-3 p-3">
                  <Avatar src={userInfo.avatar} className="w-10 h-10">
                    {userInfo.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800">{userInfo.name}</p>
                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                  </div>
                </div>
              </div>
              
              {userMenuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <Link
                to="/notifications"
                onClick={toggleMenu}
                className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <NotificationsNoneIcon className="w-5 h-5" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
              
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block w-full text-center py-3 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block w-full text-center py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          className: 'mt-2 rounded-xl shadow-xl border border-gray-100 max-w-sm w-80'
        }}
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <NotificationsNoneIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((n, i) => (
              <MenuItem key={i} className="whitespace-normal">
                <div className="w-full">
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">Just now</p>
                </div>
              </MenuItem>
            ))
          )}
        </div>
        <div className="border-t border-gray-100 p-2">
          <Link
            to="/notifications"
            onClick={handleNotificationClose}
            className="block w-full text-center py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            View All Notifications
          </Link>
        </div>
      </Menu>
    </nav>
  );
};

export default Navbar;
