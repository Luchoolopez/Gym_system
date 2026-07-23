import { useState } from 'react';
import { Plus, Pencil, Trash2, Infinity as InfinityIcon } from 'lucide-react';
import { PageTitle, Muted, Button, Chip, Input, Modal } from '../../components/ui';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { useAdminPlanes } from '../../hooks/admin/useAdminPlanes';
import { useDisclosure } from '../../hooks/useDisclosure';
import { planService } from '../../services/plan.service';
import { useToast } from '../../components/ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import { formatPrecio } from '../../utils/date.helpers';
import type { PlanDto } from '../../types/plan.types';

const emptyForm = { nombre: '', descripcion: '', precio: '', duracionDias: '', limiteClases: '', paseLibre: true };

export const AdminPlanes = () => {
  const { planes, loading, refetch } = useAdminPlanes();
  const { isOpen, open, close } = useDisclosure();
  const { showToast } = useToast();
  const [editando, setEditando] = useState<PlanDto | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [guardando, setGuardando] = useState(false);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(emptyForm);
    open();
  };

  const abrirEditar = (plan: PlanDto) => {
    setEditando(plan);
    setForm({
      nombre: plan.nombre,
      descripcion: plan.descripcion ?? '',
      precio: String(plan.precio),
      duracionDias: String(plan.duracionDias),
      limiteClases: plan.limiteClases != null ? String(plan.limiteClases) : '',
      paseLibre: plan.paseLibre,
    });
    open();
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion || undefined,
        precio: Number(form.precio),
        duracionDias: Number(form.duracionDias),
        limiteClases: form.paseLibre ? null : Number(form.limiteClases),
      };
      if (editando) {
        await planService.update(editando.id, payload);
        showToast('Plan actualizado');
      } else {
        await planService.create(payload);
        showToast('Plan creado');
      }
      close();
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo guardar el plan'), 'error');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (plan: PlanDto) => {
    if (!confirm(`¿Dar de baja el plan "${plan.nombre}"?`)) return;
    try {
      await planService.remove(plan.id);
      showToast('Plan dado de baja');
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const columns: Column<PlanDto>[] = [
    { header: 'Plan', render: (p) => <span className="font-semibold">{p.nombre}</span> },
    { header: 'Precio', render: (p) => formatPrecio(p.precio) },
    { header: 'Duración', render: (p) => `${p.duracionDias} días` },
    {
      header: 'Clases',
      render: (p) =>
        p.paseLibre ? (
          <span className="flex items-center gap-1 text-volt"><InfinityIcon size={14} /> Libre</span>
        ) : (
          p.limiteClases
        ),
    },
    { header: 'Estado', render: (p) => <Chip variant={p.activo ? 'success' : 'neutral'}>{p.activo ? 'Activo' : 'Baja'}</Chip> },
    {
      header: '',
      className: 'text-right',
      render: (p) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => abrirEditar(p)} className="text-muted hover:text-volt" aria-label="Editar">
            <Pencil size={16} />
          </button>
          <button onClick={() => handleEliminar(p)} className="text-muted hover:text-error" aria-label="Eliminar">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <PageTitle>Planes</PageTitle>
          <Muted className="mt-2">Gestioná los planes de membresía del club.</Muted>
        </div>
        <Button onClick={abrirNuevo}>
          <Plus size={16} /> Nuevo plan
        </Button>
      </div>

      <div className="mt-8">
        <DataTable columns={columns} rows={planes} loading={loading} keyExtractor={(p) => p.id} />
      </div>

      <Modal isOpen={isOpen} onClose={close} title={editando ? 'Editar plan' : 'Nuevo plan'}>
        <div className="flex flex-col gap-4">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input label="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio" type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
            <Input label="Duración (días)" type="number" value={form.duracionDias} onChange={(e) => setForm({ ...form, duracionDias: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.paseLibre}
              onChange={(e) => setForm({ ...form, paseLibre: e.target.checked })}
              className="accent-volt w-4 h-4"
            />
            Pase libre (clases ilimitadas)
          </label>
          {!form.paseLibre && (
            <Input
              label="Límite de clases"
              type="number"
              value={form.limiteClases}
              onChange={(e) => setForm({ ...form, limiteClases: e.target.value })}
            />
          )}
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button onClick={handleGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
