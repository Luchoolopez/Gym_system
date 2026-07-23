import { Modal, Chip, Button, Spinner, EmptyState } from '../ui';
import { useInscriptos } from '../../hooks/profesor/useInscriptos';
import { reservaService } from '../../services/reserva.service';
import { useToast } from '../ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import { formatFechaCorta } from '../../utils/date.helpers';
import type { HorarioDto } from '../../types/horario.types';
import type { EstadoReserva } from '../../types/reserva.types';

interface InscriptosModalProps {
  horario: HorarioDto;
  fecha: string;
  onClose: () => void;
}

const estadoChip: Record<EstadoReserva, { label: string; variant: 'volt' | 'success' | 'error' | 'neutral' }> = {
  RESERVED: { label: 'Reservada', variant: 'volt' },
  ATTENDED: { label: 'Asistió', variant: 'success' },
  NO_SHOW: { label: 'No vino', variant: 'error' },
  CANCELLED: { label: 'Cancelada', variant: 'neutral' },
};

export const InscriptosModal: React.FC<InscriptosModalProps> = ({ horario, fecha, onClose }) => {
  const { inscriptos, loading, refetch } = useInscriptos(horario.id, fecha);
  const { showToast } = useToast();

  const marcar = async (reservaId: number, estado: 'ATTENDED' | 'NO_SHOW') => {
    try {
      await reservaService.marcarAsistencia(reservaId, estado);
      showToast('Asistencia registrada');
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={`${horario.actividad?.nombre} · ${horario.dia}`} maxWidth="max-w-xl">
      <p className="text-sm text-muted capitalize mb-4">{formatFechaCorta(fecha)}</p>

      {loading ? (
        <Spinner />
      ) : !inscriptos || inscriptos.inscriptos.length === 0 ? (
        <EmptyState>No hay inscriptos para esta clase.</EmptyState>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted mb-2">
            {inscriptos.reservados} inscriptos{inscriptos.cupo != null && ` · cupo ${inscriptos.cupo}`}
          </p>
          {inscriptos.inscriptos.map((i) => (
            <div key={i.reservaId} className="flex items-center justify-between gap-3 border border-outline p-3">
              <div>
                <span className="font-semibold text-sm">
                  {i.usuario?.nombre} {i.usuario?.apellido}
                </span>
                <span className="text-xs text-muted ml-2">{i.usuario?.dni}</span>
              </div>
              {i.estado === 'RESERVED' ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => marcar(i.reservaId, 'ATTENDED')}>Asistió</Button>
                  <Button size="sm" variant="danger" onClick={() => marcar(i.reservaId, 'NO_SHOW')}>No vino</Button>
                </div>
              ) : (
                <Chip variant={estadoChip[i.estado].variant}>{estadoChip[i.estado].label}</Chip>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
