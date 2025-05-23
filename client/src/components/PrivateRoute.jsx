// src/components/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
