import { Clock, MapPin, User, Users } from 'lucide-react';
import { Button, Chip } from '../ui';
import { formatHora } from '../../utils/date.helpers';
import type { ClaseDelDiaDto, EstadoClase } from '../../types/reserva.types';

interface ClaseCardProps {
  clase: ClaseDelDiaDto;
  yaReservada: boolean;
  onReservar: (horarioId: number) => void;
  reservando: boolean;
}

// Mapeo de estado calculado -> texto y color (como en el sitio de referencia)
const estadoInfo: Record<EstadoClase, { label: string; variant: 'volt' | 'neutral' | 'warning' | 'error' }> = {
  DISPONIBLE: { label: 'Disponible', variant: 'volt' },
  COMPLETA: { label: 'Completa', variant: 'error' },
  CERRADA: { label: 'Clase cerrada', variant: 'warning' },
  EN_CURSO: { label: 'Ya empezó', variant: 'neutral' },
  FINALIZADA: { label: 'Finalizada', variant: 'neutral' },
};

export const ClaseCard: React.FC<ClaseCardProps> = ({ clase, yaReservada, onReservar, reservando }) => {
  const info = estadoInfo[clase.estado];
  const puedeReservar = clase.estado === 'DISPONIBLE' && !yaReservada;

  return (
    <div className="border border-outline bg-surface-card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-anton text-xl uppercase tracking-wide">{clase.actividad?.nombre}</h3>
        <Chip variant={info.variant}>{yaReservada ? 'Reservada' : info.label}</Chip>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm text-muted flex-1">
        <span className="flex items-center gap-2">
          <Clock size={14} className="text-volt" />
          {formatHora(clase.horaInicio)} - {formatHora(clase.horaFin)}
        </span>
        {clase.profesor && (
          <span className="flex items-center gap-2">
            <User size={14} className="text-volt" />
            {clase.profesor.nombre} {clase.profesor.apellido}
          </span>
        )}
        {clase.sala && (
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-volt" />
            {clase.sala}
          </span>
        )}
        <span className="flex items-center gap-2">
          <Users size={14} className="text-volt" />
          {clase.cupo == null
            ? 'Sin límite de cupo'
            : `${clase.reservados}/${clase.cupo} · ${clase.cuposDisponibles} libres`}
        </span>
      </div>

      <div className="mt-5">
        {yaReservada ? (
          <Button variant="secondary" fullWidth disabled>
            Ya reservaste
          </Button>
        ) : (
          <Button fullWidth disabled={!puedeReservar || reservando} onClick={() => onReservar(clase.horarioId)}>
            {reservando ? 'Reservando...' : puedeReservar ? 'Reservar' : info.label}
          </Button>
        )}
      </div>
    </div>
  );
};
