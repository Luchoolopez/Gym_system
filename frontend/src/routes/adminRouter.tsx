import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layout/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminCheckIn } from '../pages/admin/AdminCheckIn';
import { AdminUsuarios } from '../pages/admin/AdminUsuarios';
import { AdminSuscripciones } from '../pages/admin/AdminSuscripciones';
import { AdminPlanes } from '../pages/admin/AdminPlanes';
import { AdminHorarios } from '../pages/admin/AdminHorarios';

export const AdminRouter = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="checkin" element={<AdminCheckIn />} />
      <Route path="usuarios" element={<AdminUsuarios />} />
      <Route path="suscripciones" element={<AdminSuscripciones />} />
      <Route path="planes" element={<AdminPlanes />} />
      <Route path="horarios" element={<AdminHorarios />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Route>
  </Routes>
);
