import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
  const isShopLoggedIn = localStorage.getItem('isShopLoggedIn') === 'true';

  if (!isShopLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default PrivateRoute;
