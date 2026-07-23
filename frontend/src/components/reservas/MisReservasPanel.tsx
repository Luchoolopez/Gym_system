import { Clock, Calendar } from 'lucide-react';
import { Button, Chip, EmptyState } from '../ui';
import { formatHora, formatFechaCorta } from '../../utils/date.helpers';
import type { ReservaDto, EstadoReserva } from '../../types/reserva.types';

interface MisReservasPanelProps {
  reservas: ReservaDto[];
  onCancelar: (id: number) => void;
  cancelandoId: number | null;
}

const estadoChip: Record<EstadoReserva, { label: string; variant: 'volt' | 'neutral' | 'success' | 'error' }> = {
  RESERVED: { label: 'Reservada', variant: 'volt' },
  ATTENDED: { label: 'Asististe', variant: 'success' },
  CANCELLED: { label: 'Cancelada', variant: 'neutral' },
  NO_SHOW: { label: 'No asististe', variant: 'error' },
};

export const MisReservasPanel: React.FC<MisReservasPanelProps> = ({ reservas, onCancelar, cancelandoId }) => {
  if (reservas.length === 0) {
    return <EmptyState>Todavía no tenés reservas. Reservá tu primera clase.</EmptyState>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reservas.map((r) => {
        const chip = estadoChip[r.estado];
        return (
          <div key={r.id} className="border border-outline bg-surface-card p-4 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-anton text-lg uppercase">{r.actividad}</h4>
                <Chip variant={chip.variant}>{chip.label}</Chip>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span className="flex items-center gap-1 capitalize">
                  <Calendar size={12} className="text-volt" />
                  {formatFechaCorta(r.fecha)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-volt" />
                  {formatHora(r.horaInicio)} - {formatHora(r.horaFin)}
                </span>
              </div>
            </div>
            {r.estado === 'RESERVED' && (
              <Button variant="danger" size="sm" disabled={cancelandoId === r.id} onClick={() => onCancelar(r.id)}>
                {cancelandoId === r.id ? '...' : 'Cancelar'}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
