import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageTitle, Muted, Spinner, EmptyState, SectionTitle } from '../components/ui';
import { ClaseCard } from '../components/reservas/ClaseCard';
import { MisReservasPanel } from '../components/reservas/MisReservasPanel';
import { useClasesDelDia } from '../hooks/useClasesDelDia';
import { useMisReservas } from '../hooks/useMisReservas';
import { reservaService } from '../services/reserva.service';
import { useToast } from '../components/ui/toast';
import { extractErrorMessage } from '../utils/api.helpers';
import { hoyStr, sumarDias, formatFechaCorta } from '../utils/date.helpers';

export const Reservas = () => {
  const [fecha, setFecha] = useState(hoyStr());
  const { clases, loading, refetch: refetchClases } = useClasesDelDia(fecha);
  const { reservas, refetch: refetchReservas } = useMisReservas();
  const { showToast } = useToast();

  const [reservandoId, setReservandoId] = useState<number | null>(null);
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  // Horarios ya reservados por el usuario para esta fecha (para deshabilitar el botón)
  const reservadosEnFecha = useMemo(() => {
    const set = new Set<number>();
    for (const r of reservas) {
      if (r.fecha === fecha && (r.estado === 'RESERVED' || r.estado === 'ATTENDED')) {
        set.add(r.horarioId);
      }
    }
    return set;
  }, [reservas, fecha]);

  const handleReservar = async (horarioId: number) => {
    setReservandoId(horarioId);
    try {
      await reservaService.create({ horarioId, fecha });
      showToast('Reserva realizada con éxito');
      await Promise.all([refetchClases(), refetchReservas()]);
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo reservar'), 'error');
    } finally {
      setReservandoId(null);
    }
  };

  const handleCancelar = async (id: number) => {
    setCancelandoId(id);
    try {
      await reservaService.cancelar(id);
      showToast('Reserva cancelada');
      await Promise.all([refetchClases(), refetchReservas()]);
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo cancelar'), 'error');
    } finally {
      setCancelandoId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <PageTitle>Reservá tu clase</PageTitle>
      <Muted className="mt-2">Elegí el día y asegurá tu lugar. Los cupos se actualizan en tiempo real.</Muted>

      {/* Selector de fecha */}
      <div className="mt-8 flex items-center gap-4">
        <button
          className="border border-outline p-2 text-muted hover:text-volt hover:border-volt transition-colors"
          onClick={() => setFecha(sumarDias(fecha, -1))}
          disabled={fecha <= hoyStr()}
          aria-label="Día anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="min-w-52 text-center">
          <div className="font-anton text-xl uppercase capitalize">{formatFechaCorta(fecha)}</div>
          {fecha === hoyStr() && <span className="text-[11px] uppercase tracking-[0.2em] text-volt">Hoy</span>}
        </div>
        <button
          className="border border-outline p-2 text-muted hover:text-volt hover:border-volt transition-colors"
          onClick={() => setFecha(sumarDias(fecha, 1))}
          aria-label="Día siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Clases del día */}
        <div className="lg:col-span-2">
          {loading ? (
            <Spinner />
          ) : clases.length === 0 ? (
            <EmptyState>No hay clases programadas para este día.</EmptyState>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clases.map((clase) => (
                <ClaseCard
                  key={clase.horarioId}
                  clase={clase}
                  yaReservada={reservadosEnFecha.has(clase.horarioId)}
                  onReservar={handleReservar}
                  reservando={reservandoId === clase.horarioId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mis reservas */}
        <div>
          <SectionTitle className="mb-4">
            <span className="text-2xl">Mis reservas</span>
          </SectionTitle>
          <MisReservasPanel reservas={reservas} onCancelar={handleCancelar} cancelandoId={cancelandoId} />
        </div>
      </div>
    </div>
  );
};
