import { Flame, CalendarCheck, XCircle } from 'lucide-react';
import type { MisEstadisticasDto } from '../../types/stats.types';

const Stat: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => (
  <div className="border border-outline bg-surface-card p-5 text-center">
    <div className="flex justify-center text-volt mb-2">{icon}</div>
    <div className="font-anton text-3xl">{value}</div>
    <div className="text-[10px] uppercase tracking-[0.15em] text-muted mt-1">{label}</div>
  </div>
);

export const StatsResumen: React.FC<{ stats: MisEstadisticasDto | null }> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Stat icon={<Flame size={20} />} value={stats.totalAsistencias} label="Asistencias" />
      <Stat icon={<CalendarCheck size={20} />} value={stats.reservasAsistidas} label="Clases hechas" />
      <Stat icon={<XCircle size={20} />} value={stats.reservasCanceladas} label="Canceladas" />
    </div>
  );
};
