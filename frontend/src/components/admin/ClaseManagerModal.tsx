import { useState } from 'react';
import { Clock, MapPin, Pencil, Trash2, UserPlus, Check, X, UserMinus } from 'lucide-react';
import { Modal, Button, Chip, Select, Spinner, EmptyState } from '../ui';
import { useInscriptos } from '../../hooks/profesor/useInscriptos';
import { reservaService } from '../../services/reserva.service';
import { useToast } from '../ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import { formatHora, formatFechaCorta } from '../../utils/date.helpers';
import type { HorarioDto } from '../../types/horario.types';
import type { UsuarioAdminDto } from '../../types/usuario.types';
import type { EstadoReserva } from '../../types/reserva.types';

interface ClaseManagerModalProps {
  horario: HorarioDto;
  fecha: string;
  socios: UsuarioAdminDto[];
  onClose: () => void;
  onEditar: (horario: HorarioDto) => void;
  onEliminar: (horario: HorarioDto) => void;
  onChanged: () => void; // refrescar ocupación del calendario
}

const estadoChip: Record<EstadoReserva, { label: string; variant: 'volt' | 'success' | 'error' | 'neutral' }> = {
  RESERVED: { label: 'Anotado', variant: 'volt' },
  ATTENDED: { label: 'Asistió', variant: 'success' },
  NO_SHOW: { label: 'No vino', variant: 'error' },
  CANCELLED: { label: 'Cancelada', variant: 'neutral' },
};

export const ClaseManagerModal: React.FC<ClaseManagerModalProps> = ({
  horario, fecha, socios, onClose, onEditar, onEliminar, onChanged,
}) => {
  const { inscriptos, loading, refetch } = useInscriptos(horario.id, fecha);
  const { showToast } = useToast();
  const [socioSel, setSocioSel] = useState('');
  const [accion, setAccion] = useState(false);

  const refrescar = async () => {
    await refetch();
    onChanged();
  };

  const anotar = async () => {
    if (!socioSel) return;
    setAccion(true);
    try {
      await reservaService.adminCreate({ usuarioId: Number(socioSel), horarioId: horario.id, fecha });
      showToast('Socio anotado en la clase');
      setSocioSel('');
      await refrescar();
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo anotar'), 'error');
    } finally {
      setAccion(false);
    }
  };

  const marcar = async (reservaId: number, estado: 'ATTENDED' | 'NO_SHOW') => {
    try {
      await reservaService.marcarAsistencia(reservaId, estado);
      showToast('Asistencia registrada');
      await refrescar();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const quitar = async (reservaId: number) => {
    try {
      await reservaService.adminQuitar(reservaId);
      showToast('Socio quitado de la clase');
      await refrescar();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  // Socios que todavía no están anotados (para el selector)
  const anotadosIds = new Set(inscriptos?.inscriptos.map((i) => i.usuario?.id));
  const disponibles = socios.filter((s) => !anotadosIds.has(s.id));

  const cupoLleno =
    horario.cupo != null && (inscriptos?.reservados ?? 0) >= horario.cupo;

  return (
    <Modal isOpen onClose={onClose} title={horario.actividad?.nombre ?? 'Clase'} maxWidth="max-w-2xl">
      {/* Encabezado de la clase */}
      <div className="flex items-start justify-between gap-4 border-b border-outline pb-4">
        <div className="flex flex-col gap-1 text-sm text-muted">
          <span className="capitalize text-on-surface font-semibold">{formatFechaCorta(fecha)}</span>
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-volt" />
            {formatHora(horario.horaInicio)} - {formatHora(horario.horaFin)}
          </span>
          {horario.sala && (
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-volt" />
              {horario.sala}
            </span>
          )}
          <span>
            {horario.cupo == null ? 'Cupo libre' : `Cupo ${inscriptos?.reservados ?? 0}/${horario.cupo}`}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEditar(horario)} className="text-muted hover:text-volt p-1" title="Editar horario">
            <Pencil size={16} />
          </button>
          <button onClick={() => onEliminar(horario)} className="text-muted hover:text-error p-1" title="Eliminar horario">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Anotar socio */}
      <div className="flex items-end gap-3 py-4 border-b border-outline">
        <Select
          label="Anotar socio (presencial)"
          placeholder={cupoLleno ? 'Clase completa' : 'Elegí un socio'}
          options={disponibles.map((s) => ({ value: s.id, label: `${s.nombre} ${s.apellido}${s.dni ? ` · ${s.dni}` : ''}` }))}
          value={socioSel}
          onChange={(e) => setSocioSel(e.target.value)}
          disabled={cupoLleno}
        />
        <Button onClick={anotar} disabled={!socioSel || accion || cupoLleno}>
          <UserPlus size={16} /> Anotar
        </Button>
      </div>

      {/* Lista de inscriptos */}
      <div className="pt-4">
        <h4 className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted mb-3">
          Inscriptos {inscriptos && `(${inscriptos.reservados})`}
        </h4>

        {loading ? (
          <Spinner />
        ) : !inscriptos || inscriptos.inscriptos.length === 0 ? (
          <EmptyState>Todavía no hay socios anotados.</EmptyState>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {inscriptos.inscriptos.map((i) => (
              <div key={i.reservaId} className="flex items-center justify-between gap-3 border border-outline p-3">
                <div>
                  <span className="font-semibold text-sm">
                    {i.usuario?.nombre} {i.usuario?.apellido}
                  </span>
                  {i.usuario?.dni && <span className="text-xs text-muted ml-2">{i.usuario.dni}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {i.estado === 'RESERVED' ? (
                    <>
                      <button
                        onClick={() => marcar(i.reservaId, 'ATTENDED')}
                        className="flex items-center gap-1 text-[11px] font-bold uppercase text-success border border-success/40 px-2 py-1 hover:bg-success hover:text-carbon transition-colors"
                      >
                        <Check size={13} /> Vino
                      </button>
                      <button
                        onClick={() => marcar(i.reservaId, 'NO_SHOW')}
                        className="flex items-center gap-1 text-[11px] font-bold uppercase text-warning border border-warning/40 px-2 py-1 hover:bg-warning hover:text-carbon transition-colors"
                      >
                        <X size={13} /> No vino
                      </button>
                    </>
                  ) : (
                    <Chip variant={estadoChip[i.estado].variant}>{estadoChip[i.estado].label}</Chip>
                  )}
                  <button
                    onClick={() => quitar(i.reservaId)}
                    className="text-muted hover:text-error p-1"
                    title="Quitar de la clase"
                  >
                    <UserMinus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
