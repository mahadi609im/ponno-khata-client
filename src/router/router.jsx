import { createBrowserRouter } from 'react-router';
import HomePage from '../Pages/HomePage';
import MainLayout from '../Layout/MainLayout';
import LoginPage from '../Pages/LoginPage';
import AuthLayout from '../Layout/AuthLayout';
import PrivateRoute from '../Private/PrivateRoute';
import PublicRoute from '../Private/PublicRoute';
import NotFound from '../Components/NotFound';
import RegisterPage from '../Pages/RegisterPage';

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
    path: '/auth',
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
      {
        path: 'login',
        element: <LoginPage></LoginPage>,
      },
      {
        path: 'register',
        element: <RegisterPage></RegisterPage>,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound></NotFound>,
  },
]);

export default router;
