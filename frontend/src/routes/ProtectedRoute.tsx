import { Navigate, Outlet } from 'react-router-dom';
import { hasValidAuthToken } from '../utils/auth';
import type { Rol } from '../types/auth.types';

interface ProtectedRouteProps {
  // Roles permitidos; si se omite, solo requiere estar autenticado
  roles?: Rol[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user: { rol?: Rol } | null = null;

  try {
    if (userStr) user = JSON.parse(userStr);
  } catch {
    user = null;
  }

  if (!hasValidAuthToken(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  if (roles && (!user?.rol || !roles.includes(user.rol))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
