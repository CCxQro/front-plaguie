import { Navigate } from 'react-router-dom';
import useAuthStore from '../../services/Contexts/useAuthStore';

/**
 * Maps each roleId to its default route.
 * Used for redirecting unauthorized (but authenticated) users.
 */
const DEFAULT_ROUTES: Record<number, string> = {
  1: '/app',
  2: '/agricultor',
  3: '/sales-technician',
};

export const getDefaultRoute = (roleId: number): string =>
  DEFAULT_ROUTES[roleId] ?? '/login';

interface ProtectedRouteProps {
  allowedRoles: number[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuthStore();

  console.log('ProtectedRoute', user, isAuthenticated);

  if (!isAuthenticated || !user) {
    console.log('No isAuthenticated or user');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.roleId)) {
    console.log('No allowed role', user.roleId);
    return <Navigate to={getDefaultRoute(user.roleId)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
