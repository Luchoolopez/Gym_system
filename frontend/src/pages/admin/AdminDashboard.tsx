import { Users, CreditCard, AlertTriangle, DollarSign, ScanLine, CalendarClock } from 'lucide-react';
import { PageTitle, Muted, Spinner } from '../../components/ui';
import { StatCard } from '../../components/admin/StatCard';
import { useDashboard } from '../../hooks/admin/useDashboard';
import { formatPrecio } from '../../utils/date.helpers';

export const AdminDashboard = () => {
  const { dashboard, loading } = useDashboard();

  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      <Muted className="mt-2">Resumen del club en tiempo real.</Muted>

      {loading || !dashboard ? (
        <Spinner />
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard accent icon={<Users size={22} />} value={dashboard.sociosActivos} label="Socios activos" />
          <StatCard icon={<DollarSign size={22} />} value={formatPrecio(dashboard.ingresosMes)} label="Ingresos del mes" />
          <StatCard icon={<ScanLine size={22} />} value={dashboard.checkinsHoy} label="Check-ins hoy" />
          <StatCard icon={<CalendarClock size={22} />} value={dashboard.reservasHoy} label="Reservas hoy" />
          <StatCard icon={<CreditCard size={22} />} value={dashboard.pagosPendientes} label="Pagos pendientes" />
          <StatCard icon={<AlertTriangle size={22} />} value={dashboard.suscripcionesPorVencer} label="Vencen en 7 días" />
        </div>
      )}
    </div>
  );
};
