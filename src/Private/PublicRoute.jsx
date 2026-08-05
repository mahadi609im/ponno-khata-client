import { Navigate } from 'react-router';

const PublicRoute = ({ children }) => {
  const isShopLoggedIn = localStorage.getItem('isShopLoggedIn') === 'true';

  if (isShopLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
