import { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageTitle, Muted, Button, Input, Select, Modal, Spinner } from '../../components/ui';
import { CalendarSemana } from '../../components/admin/CalendarSemana';
import { ClaseManagerModal } from '../../components/admin/ClaseManagerModal';
import { useGrilla } from '../../hooks/useGrilla';
import { useAdminActividades } from '../../hooks/admin/useAdminActividades';
import { useAdminUsuarios } from '../../hooks/admin/useAdminUsuarios';
import { useSemanaOcupacion } from '../../hooks/admin/useSemanaOcupacion';
import { useDisclosure } from '../../hooks/useDisclosure';
import { horarioService } from '../../services/horario.service';
import { actividadService } from '../../services/actividad.service';
import { useToast } from '../../components/ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import { formatHora, hoyStr, inicioSemana, fechasSemana, sumarDias, formatDiaMes } from '../../utils/date.helpers';
import { DIAS_SEMANA, type DiaSemana } from '../../types/common.types';
import type { HorarioDto } from '../../types/horario.types';

const emptyForm = {
  actividadId: '', dia: 'Lunes' as DiaSemana, horaInicio: '', horaFin: '', profesorId: '', sala: '', cupo: '',
};

export const AdminHorarios = () => {
  const { horarios, loading, refetch } = useGrilla();
  const { actividades, refetch: refetchActs } = useAdminActividades();
  const { usuarios: profesores } = useAdminUsuarios({ rol: 'Profesor', limit: 100 });
  const { usuarios: socios } = useAdminUsuarios({ rol: 'User', limit: 200 });
  const { showToast } = useToast();

  // Semana visible
  const [lunes, setLunes] = useState(() => inicioSemana(hoyStr()));
  const fechas = useMemo(() => fechasSemana(lunes), [lunes]);
  const { ocupacion, refetch: refetchOcupacion } = useSemanaOcupacion(fechas);

  const horarioModal = useDisclosure();
  const actModal = useDisclosure();
  const [editando, setEditando] = useState<HorarioDto | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [nuevaAct, setNuevaAct] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Clase seleccionada en el calendario (horario + fecha concreta)
  const [claseSel, setClaseSel] = useState<{ horario: HorarioDto; fecha: string } | null>(null);

  const abrirNuevo = (dia?: DiaSemana) => {
    setEditando(null);
    setForm({ ...emptyForm, dia: dia ?? 'Lunes' });
    horarioModal.open();
  };

  const abrirEditar = (h: HorarioDto) => {
    setClaseSel(null);
    setEditando(h);
    setForm({
      actividadId: String(h.actividad?.id ?? ''),
      dia: h.dia,
      horaInicio: formatHora(h.horaInicio),
      horaFin: formatHora(h.horaFin),
      profesorId: h.profesor ? String(h.profesor.id) : '',
      sala: h.sala ?? '',
      cupo: h.cupo != null ? String(h.cupo) : '',
    });
    horarioModal.open();
  };

  const guardarHorario = async () => {
    setProcesando(true);
    try {
      const payload = {
        actividadId: Number(form.actividadId),
        dia: form.dia,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        profesorId: form.profesorId ? Number(form.profesorId) : null,
        sala: form.sala || undefined,
        cupo: form.cupo ? Number(form.cupo) : null,
      };
      if (editando) {
        await horarioService.update(editando.id, payload);
        showToast('Horario actualizado');
      } else {
        await horarioService.create(payload);
        showToast('Horario creado');
      }
      horarioModal.close();
      await Promise.all([refetch(), refetchOcupacion()]);
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo guardar'), 'error');
    } finally {
      setProcesando(false);
    }
  };

  const eliminarHorario = async (h: HorarioDto) => {
    if (!confirm(`¿Eliminar la clase de ${h.actividad?.nombre} (${h.dia} ${formatHora(h.horaInicio)})?`)) return;
    try {
      await horarioService.remove(h.id);
      showToast('Horario eliminado');
      setClaseSel(null);
      await Promise.all([refetch(), refetchOcupacion()]);
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const crearActividad = async () => {
    if (!nuevaAct.trim()) return;
    setProcesando(true);
    try {
      await actividadService.create({ nombre: nuevaAct.trim() });
      showToast('Actividad creada');
      setNuevaAct('');
      actModal.close();
      await refetchActs();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    } finally {
      setProcesando(false);
    }
  };

  const rangoSemana = `${formatDiaMes(fechas[0])} — ${formatDiaMes(fechas[6])}`;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <PageTitle>Calendario de clases</PageTitle>
          <Muted className="mt-2">Organizá la grilla y gestioná los inscriptos de cada clase.</Muted>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={actModal.open}>
            <Plus size={16} /> Actividad
          </Button>
          <Button onClick={() => abrirNuevo()}>
            <Plus size={16} /> Nueva clase
          </Button>
        </div>
      </div>

      {/* Navegación de semana */}
      <div className="mt-8 flex items-center gap-4">
        <button
          className="border border-outline p-2 text-muted hover:text-volt hover:border-volt transition-colors"
          onClick={() => setLunes(sumarDias(lunes, -7))}
          aria-label="Semana anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="min-w-40 text-center font-anton text-lg uppercase">{rangoSemana}</div>
        <button
          className="border border-outline p-2 text-muted hover:text-volt hover:border-volt transition-colors"
          onClick={() => setLunes(sumarDias(lunes, 7))}
          aria-label="Semana siguiente"
        >
          <ChevronRight size={18} />
        </button>
        <button
          className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-volt ml-2"
          onClick={() => setLunes(inicioSemana(hoyStr()))}
        >
          Hoy
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : (
          <CalendarSemana
            horarios={horarios}
            fechas={fechas}
            ocupacion={ocupacion}
            onSelectClase={(horario, fecha) => setClaseSel({ horario, fecha })}
          />
        )}
      </div>

      {/* Modal gestión de clase (inscriptos + anotar/quitar/asistencia) */}
      {claseSel && (
        <ClaseManagerModal
          horario={claseSel.horario}
          fecha={claseSel.fecha}
          socios={socios}
          onClose={() => setClaseSel(null)}
          onEditar={abrirEditar}
          onEliminar={eliminarHorario}
          onChanged={refetchOcupacion}
        />
      )}

      {/* Modal crear/editar horario */}
      <Modal isOpen={horarioModal.isOpen} onClose={horarioModal.close} title={editando ? 'Editar clase' : 'Nueva clase'}>
        <div className="flex flex-col gap-4">
          <Select
            label="Actividad"
            placeholder="Elegí una actividad"
            options={actividades.filter((a) => a.activo).map((a) => ({ value: a.id, label: a.nombre }))}
            value={form.actividadId}
            onChange={(e) => setForm({ ...form, actividadId: e.target.value })}
          />
          <Select
            label="Día"
            options={DIAS_SEMANA.map((d) => ({ value: d, label: d }))}
            value={form.dia}
            onChange={(e) => setForm({ ...form, dia: e.target.value as DiaSemana })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Hora inicio" type="time" value={form.horaInicio} onChange={(e) => setForm({ ...form, horaInicio: e.target.value })} />
            <Input label="Hora fin" type="time" value={form.horaFin} onChange={(e) => setForm({ ...form, horaFin: e.target.value })} />
          </div>
          <Select
            label="Profesor (opcional)"
            placeholder="Sin profesor"
            options={profesores.map((p) => ({ value: p.id, label: `${p.nombre} ${p.apellido}` }))}
            value={form.profesorId}
            onChange={(e) => setForm({ ...form, profesorId: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sala" value={form.sala} onChange={(e) => setForm({ ...form, sala: e.target.value })} />
            <Input label="Cupo (vacío = libre)" type="number" value={form.cupo} onChange={(e) => setForm({ ...form, cupo: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={horarioModal.close}>Cancelar</Button>
            <Button onClick={guardarHorario} disabled={procesando}>
              {procesando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal nueva actividad */}
      <Modal isOpen={actModal.isOpen} onClose={actModal.close} title="Nueva actividad">
        <div className="flex flex-col gap-4">
          <Input label="Nombre de la actividad" value={nuevaAct} onChange={(e) => setNuevaAct(e.target.value)} placeholder="Ej: Crossfit" />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={actModal.close}>Cancelar</Button>
            <Button onClick={crearActividad} disabled={procesando}>Crear</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
