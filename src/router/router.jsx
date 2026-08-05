import { createBrowserRouter } from 'react-router';
import HomePage from '../Pages/HomePage';
import MainLayout from '../Layout/MainLayout';
import LoginPage from '../Pages/LoginPage';
import AuthLayout from '../Layout/AuthLayout';
import PrivateRoute from '../Private/PrivateRoute';
import PublicRoute from '../Private/PublicRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout></MainLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage></HomePage>,
      },
    ],
  },
  {
    path: '/auth/login',
    element: (
      <PublicRoute>
        <AuthLayout></AuthLayout>
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <LoginPage></LoginPage>,
      },
    ],
  },
]);

export default router;
