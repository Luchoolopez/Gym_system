import { useState } from 'react';
import { ChevronDown, DollarSign, Users, Clock } from 'lucide-react';
import { Spinner, EmptyState } from '../ui';
import { checkinService } from '../../services/checkin.service';
import { formatFechaCorta, formatPrecio } from '../../utils/date.helpers';
import type { CierreDto } from '../../types/cierre.types';
import type { CheckInDto } from '../../types/checkin.types';

// Un día cerrado, expandible para ver la gente que ingresó ese día
const CierreItem: React.FC<{ cierre: CierreDto }> = ({ cierre }) => {
  const [abierto, setAbierto] = useState(false);
  const [gente, setGente] = useState<CheckInDto[] | null>(null);
  const [cargando, setCargando] = useState(false);

  const toggle = async () => {
    const nuevo = !abierto;
    setAbierto(nuevo);
    if (nuevo && gente === null) {
      setCargando(true);
      try {
        const res = await checkinService.getAll(cierre.fecha);
        setGente(res.items);
      } finally {
        setCargando(false);
      }
    }
  };

  return (
    <div className="border border-outline bg-surface-card">
      <button onClick={toggle} className="w-full flex items-center justify-between gap-4 p-4 text-left">
        <div className="capitalize font-anton text-lg uppercase">{formatFechaCorta(cierre.fecha)}</div>
        <div className="flex items-center gap-5 text-sm">
          <span className="flex items-center gap-1.5 text-muted">
            <Users size={14} className="text-volt" /> {cierre.totalCheckins}
          </span>
          <span className="flex items-center gap-1.5 text-success font-semibold">
            <DollarSign size={14} /> {formatPrecio(cierre.totalIngresos)}
          </span>
          <ChevronDown size={18} className={`text-muted transition-transform ${abierto ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {abierto && (
        <div className="border-t border-outline p-4">
          {cierre.cerradoPor && (
            <p className="text-[11px] text-muted mb-3">
              Cerrado por {cierre.cerradoPor.nombre} {cierre.cerradoPor.apellido}
            </p>
          )}
          {cargando ? (
            <Spinner />
          ) : !gente || gente.length === 0 ? (
            <EmptyState>No hubo ingresos ese día.</EmptyState>
          ) : (
            <div className="flex flex-col gap-2">
              {gente.map((g) => (
                <div key={g.id} className="flex items-center justify-between gap-3 border border-outline px-3 py-2 text-sm">
                  <span className="font-semibold">
                    {g.usuario?.nombre} {g.usuario?.apellido}
                    {g.usuario?.dni && <span className="text-xs text-muted ml-2">{g.usuario.dni}</span>}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Clock size={12} />
                    {new Date(g.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CierreHistorial: React.FC<{ cierres: CierreDto[]; loading: boolean }> = ({ cierres, loading }) => {
  if (loading) return <Spinner />;
  if (cierres.length === 0) return <EmptyState>Todavía no cerraste ningún día.</EmptyState>;

  return (
    <div className="flex flex-col gap-3">
      {cierres.map((c) => (
        <CierreItem key={c.id} cierre={c} />
      ))}
    </div>
  );
};
