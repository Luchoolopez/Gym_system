import { useState } from 'react';
import { Plus, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { PageTitle, Muted, Button, Chip, Input, Modal } from '../../components/ui';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { useAdminActividades } from '../../hooks/admin/useAdminActividades';
import { useDisclosure } from '../../hooks/useDisclosure';
import { actividadService } from '../../services/actividad.service';
import { useToast } from '../../components/ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import type { ActividadDto } from '../../types/actividad.types';

const emptyForm = { nombre: '', descripcion: '' };

export const AdminActividades = () => {
  const { actividades, loading, refetch } = useAdminActividades();
  const { isOpen, open, close } = useDisclosure();
  const { showToast } = useToast();
  const [editando, setEditando] = useState<ActividadDto | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [guardando, setGuardando] = useState(false);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(emptyForm);
    open();
  };

  const abrirEditar = (act: ActividadDto) => {
    setEditando(act);
    setForm({ nombre: act.nombre, descripcion: act.descripcion ?? '' });
    open();
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const payload = { nombre: form.nombre, descripcion: form.descripcion || undefined };
      if (editando) {
        await actividadService.update(editando.id, payload);
        showToast('Actividad actualizada');
      } else {
        await actividadService.create(payload);
        showToast('Actividad creada');
      }
      close();
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo guardar'), 'error');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (act: ActividadDto) => {
    if (!confirm(`¿Dar de baja la actividad "${act.nombre}"?`)) return;
    try {
      await actividadService.remove(act.id);
      showToast('Actividad dada de baja');
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const handleReactivar = async (act: ActividadDto) => {
    try {
      await actividadService.update(act.id, { activo: true });
      showToast('Actividad reactivada');
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const columns: Column<ActividadDto>[] = [
    { header: 'Actividad', render: (a) => <span className="font-semibold">{a.nombre}</span> },
    { header: 'Descripción', render: (a) => <span className="text-muted">{a.descripcion || '—'}</span> },
    { header: 'Estado', render: (a) => <Chip variant={a.activo ? 'success' : 'neutral'}>{a.activo ? 'Activa' : 'Baja'}</Chip> },
    {
      header: '',
      className: 'text-right',
      render: (a) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => abrirEditar(a)} className="text-muted hover:text-volt" aria-label="Editar">
            <Pencil size={16} />
          </button>
          {a.activo ? (
            <button onClick={() => handleEliminar(a)} className="text-muted hover:text-error" aria-label="Dar de baja">
              <Trash2 size={16} />
            </button>
          ) : (
            <button onClick={() => handleReactivar(a)} className="text-muted hover:text-success" aria-label="Reactivar">
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <PageTitle>Actividades</PageTitle>
          <Muted className="mt-2">Creá, editá o dá de baja las actividades del gimnasio.</Muted>
        </div>
        <Button onClick={abrirNuevo}>
          <Plus size={16} /> Nueva actividad
        </Button>
      </div>

      <div className="mt-8">
        <DataTable columns={columns} rows={actividades} loading={loading} keyExtractor={(a) => a.id} />
      </div>

      <Modal isOpen={isOpen} onClose={close} title={editando ? 'Editar actividad' : 'Nueva actividad'}>
        <div className="flex flex-col gap-4">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Crossfit" />
          <Input label="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Opcional" />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button onClick={handleGuardar} disabled={guardando || !form.nombre}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
