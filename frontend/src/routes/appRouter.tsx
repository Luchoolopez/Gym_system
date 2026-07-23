import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { Home } from '../pages/Home';
import { Horarios } from '../pages/Horarios';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Reservas } from '../pages/Reservas';
import { Perfil } from '../pages/Perfil';
import { ProfesorPanel } from '../pages/profesor/ProfesorPanel';
import { AdminRouter } from './adminRouter';
import { ProtectedRoute } from './ProtectedRoute';
import { hasValidAuthToken } from '../utils/auth';

const PublicOnlyRoute = () => {
  const token = localStorage.getItem('token');
  if (hasValidAuthToken(token)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas con navbar + footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/horarios" element={<Horarios />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route element={<ProtectedRoute roles={['Profesor', 'Admin']} />}>
          <Route path="/profesor" element={<ProfesorPanel />} />
        </Route>
      </Route>

      {/* Panel admin con su propio layout (sidebar) */}
      <Route element={<ProtectedRoute roles={['Admin']} />}>
        <Route path="/admin/*" element={<AdminRouter />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
