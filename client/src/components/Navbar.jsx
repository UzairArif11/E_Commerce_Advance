import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          eShop
        </Link>

        <div className="flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-blue-600">
            Cart
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
