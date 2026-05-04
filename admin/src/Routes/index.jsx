import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import Dashboard from '../Pages/Dashboard';
import UserList from '../Pages/Users/UserList';
import HotelList from '../Pages/Hotels/HotelList';
import AnalyticsDashboard from '../Pages/Analytics/Dashboard';
import ProviderDashboard from '../Pages/ServiceProvider/ProviderDashboard';
import ProtectedRoute from '../Components/ProtectedRoute';
import NotFound from '../Pages/NotFound';

const Routers = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/login' replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredRole='admin'>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute requiredRole='admin'>
        <UserList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hotels',
    element: (
      <ProtectedRoute requiredRole='admin'>
        <HotelList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute requiredRole='admin'>
        <AnalyticsDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/provider',
    element: (
      <ProtectedRoute requiredRole='service_provider'>
        <ProviderDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default Routers;
