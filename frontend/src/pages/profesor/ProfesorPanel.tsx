import { useState } from 'react';
import { Clock, MapPin, Users, Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import { PageTitle, Muted, SectionTitle, Button, Chip, Spinner, EmptyState } from '../../components/ui';
import { InscriptosModal } from '../../components/profesor/InscriptosModal';
import { RutinaFormModal } from '../../components/profesor/RutinaFormModal';
import { useAuthContext } from '../../context/authContext';
import { useMisClases } from '../../hooks/profesor/useMisClases';
import { useRutinasCreadas } from '../../hooks/profesor/useRutinasCreadas';
import { useAdminUsuarios } from '../../hooks/admin/useAdminUsuarios';
import { useDisclosure } from '../../hooks/useDisclosure';
import { rutinaService } from '../../services/rutina.service';
import { useToast } from '../../components/ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import { formatHora, hoyStr, formatFechaCorta } from '../../utils/date.helpers';
import type { HorarioDto } from '../../types/horario.types';
import type { RutinaDto } from '../../types/rutina.types';

export const ProfesorPanel = () => {
  const { user } = useAuthContext();
  const { clases, loading: loadingClases } = useMisClases(user?.id);
  const { rutinas, loading: loadingRutinas, refetch: refetchRutinas } = useRutinasCreadas();
  const { usuarios: socios } = useAdminUsuarios({ rol: 'User', limit: 100 });
  const { showToast } = useToast();

  const [claseSel, setClaseSel] = useState<HorarioDto | null>(null);
  const [fecha, setFecha] = useState(hoyStr());
  const rutinaModal = useDisclosure();
  const [rutinaEdit, setRutinaEdit] = useState<RutinaDto | null>(null);

  const abrirRutina = (rutina: RutinaDto | null) => {
    setRutinaEdit(rutina);
    rutinaModal.open();
  };

  const eliminarRutina = async (r: RutinaDto) => {
    if (!confirm(`¿Eliminar la rutina "${r.titulo}"?`)) return;
    try {
      await rutinaService.remove(r.id);
      showToast('Rutina eliminada');
      await refetchRutinas();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <PageTitle>Panel del profesor</PageTitle>
      <Muted className="mt-2">Tus clases asignadas, los inscriptos y las rutinas que creás.</Muted>

      {/* Mis clases */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <SectionTitle><span className="text-2xl">Mis clases</span></SectionTitle>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="bg-graphite border border-outline px-3 py-2 text-sm outline-none focus:border-volt"
          />
        </div>

        {loadingClases ? (
          <Spinner />
        ) : clases.length === 0 ? (
          <EmptyState>No tenés clases asignadas.</EmptyState>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clases.map((h) => (
              <div key={h.id} className="border border-outline bg-surface-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-anton text-xl uppercase">{h.actividad?.nombre}</h3>
                  <Chip variant="neutral">{h.dia}</Chip>
                </div>
                <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
                  <span className="flex items-center gap-2"><Clock size={14} className="text-volt" />{formatHora(h.horaInicio)} - {formatHora(h.horaFin)}</span>
                  {h.sala && <span className="flex items-center gap-2"><MapPin size={14} className="text-volt" />{h.sala}</span>}
                </div>
                <Button variant="secondary" size="sm" fullWidth className="mt-4" onClick={() => setClaseSel(h)}>
                  <Users size={14} /> Ver inscriptos
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rutinas */}
      <section className="mt-14">
        <div className="flex items-center justify-between gap-4 mb-4">
          <SectionTitle><span className="text-2xl">Rutinas creadas</span></SectionTitle>
          <Button onClick={() => abrirRutina(null)}>
            <Plus size={16} /> Nueva rutina
          </Button>
        </div>

        {loadingRutinas ? (
          <Spinner />
        ) : rutinas.length === 0 ? (
          <EmptyState>Todavía no creaste rutinas.</EmptyState>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rutinas.map((r) => (
              <div key={r.id} className="border border-outline bg-surface-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-volt shrink-0" />
                    <div>
                      <h4 className="font-anton text-lg uppercase">{r.titulo}</h4>
                      <span className="text-xs text-muted">
                        Para {r.usuario?.nombre} {r.usuario?.apellido}
                        {r.fechaActualizacion && ` · ${formatFechaCorta(r.fechaActualizacion.slice(0, 10))}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => abrirRutina(r)} className="text-muted hover:text-volt" aria-label="Editar"><Pencil size={15} /></button>
                    <button onClick={() => eliminarRutina(r)} className="text-muted hover:text-error" aria-label="Eliminar"><Trash2 size={15} /></button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted line-clamp-2 whitespace-pre-wrap">{r.contenido}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {claseSel && <InscriptosModal horario={claseSel} fecha={fecha} onClose={() => setClaseSel(null)} />}
      {rutinaModal.isOpen && (
        <RutinaFormModal socios={socios} editando={rutinaEdit} onClose={rutinaModal.close} onSaved={refetchRutinas} />
      )}
    </div>
  );
};
