import { Navigate } from 'react-router-dom';
import { getDefaultRoute } from '../ProtectedRoute/routes';
import useAuthStore from '../../services/Contexts/useAuthStore';

export function DefaultRedirect() {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRoute(user.roleId)} replace />;
  }

  return <Navigate to="/login" replace />;
}
