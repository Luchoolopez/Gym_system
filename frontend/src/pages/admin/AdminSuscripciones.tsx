import { useState } from 'react';
import { Plus, DollarSign, RefreshCw, XCircle } from 'lucide-react';
import { PageTitle, Muted, Button, Chip, Input, Select, Modal } from '../../components/ui';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { useAdminSuscripciones } from '../../hooks/admin/useAdminSuscripciones';
import { useAdminUsuarios } from '../../hooks/admin/useAdminUsuarios';
import { usePlanes } from '../../hooks/usePlanes';
import { useDisclosure } from '../../hooks/useDisclosure';
import { suscripcionService } from '../../services/suscripcion.service';
import { pagoService } from '../../services/pago.service';
import { useToast } from '../../components/ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import { formatFechaCorta } from '../../utils/date.helpers';
import { METODOS_PAGO, type MetodoPago } from '../../types/pago.types';
import type { SuscripcionDto } from '../../types/suscripcion.types';

const estadoChip = {
  PAID: { label: 'Pagada', variant: 'success' as const },
  PENDING: { label: 'Pendiente', variant: 'warning' as const },
  CANCELLED: { label: 'Cancelada', variant: 'neutral' as const },
};

export const AdminSuscripciones = () => {
  const { suscripciones, loading, refetch } = useAdminSuscripciones();
  const { usuarios } = useAdminUsuarios({ rol: 'User', limit: 100 });
  const { planes } = usePlanes();
  const { showToast } = useToast();

  const nueva = useDisclosure();
  const pago = useDisclosure();
  const [formNueva, setFormNueva] = useState({ usuarioId: '', planId: '' });
  const [subPago, setSubPago] = useState<SuscripcionDto | null>(null);
  const [formPago, setFormPago] = useState({ monto: '', metodo: 'CASH' as MetodoPago });
  const [procesando, setProcesando] = useState(false);

  const crearSuscripcion = async () => {
    setProcesando(true);
    try {
      await suscripcionService.create({ usuarioId: Number(formNueva.usuarioId), planId: Number(formNueva.planId) });
      showToast('Suscripción creada');
      nueva.close();
      setFormNueva({ usuarioId: '', planId: '' });
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo crear'), 'error');
    } finally {
      setProcesando(false);
    }
  };

  const abrirPago = (sub: SuscripcionDto) => {
    setSubPago(sub);
    setFormPago({ monto: sub.plan ? String(sub.plan.precio) : '', metodo: 'CASH' });
    pago.open();
  };

  const registrarPago = async () => {
    if (!subPago) return;
    setProcesando(true);
    try {
      await pagoService.create({ suscripcionId: subPago.id, monto: Number(formPago.monto), metodo: formPago.metodo });
      showToast('Pago registrado');
      pago.close();
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo registrar el pago'), 'error');
    } finally {
      setProcesando(false);
    }
  };

  const renovar = async (sub: SuscripcionDto) => {
    if (!confirm(`¿Renovar la suscripción de ${sub.usuario?.nombre}?`)) return;
    try {
      await suscripcionService.renovar(sub.id);
      showToast('Suscripción renovada');
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const cancelar = async (sub: SuscripcionDto) => {
    if (!confirm(`¿Cancelar la suscripción de ${sub.usuario?.nombre}?`)) return;
    try {
      await suscripcionService.cancelar(sub.id);
      showToast('Suscripción cancelada');
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const columns: Column<SuscripcionDto>[] = [
    {
      header: 'Socio',
      render: (s) => <span className="font-semibold">{s.usuario ? `${s.usuario.nombre} ${s.usuario.apellido}` : '—'}</span>,
    },
    { header: 'Plan', render: (s) => s.plan?.nombre ?? '—' },
    { header: 'Vence', render: (s) => <span className="capitalize text-muted">{formatFechaCorta(s.fechaFin)}</span> },
    {
      header: 'Clases',
      render: (s) => (s.clasesRestantes == null ? 'Libre' : s.clasesRestantes),
    },
    { header: 'Pago', render: (s) => <Chip variant={estadoChip[s.estadoPago].variant}>{estadoChip[s.estadoPago].label}</Chip> },
    {
      header: '',
      className: 'text-right',
      render: (s) => (
        <div className="flex justify-end gap-2">
          {s.estadoPago === 'PENDING' && (
            <button onClick={() => abrirPago(s)} className="text-muted hover:text-success" title="Registrar pago">
              <DollarSign size={16} />
            </button>
          )}
          <button onClick={() => renovar(s)} className="text-muted hover:text-volt" title="Renovar">
            <RefreshCw size={16} />
          </button>
          {s.estadoPago !== 'CANCELLED' && (
            <button onClick={() => cancelar(s)} className="text-muted hover:text-error" title="Cancelar">
              <XCircle size={16} />
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
          <PageTitle>Suscripciones</PageTitle>
          <Muted className="mt-2">Asigná planes, registrá pagos y renovaciones.</Muted>
        </div>
        <Button onClick={nueva.open}>
          <Plus size={16} /> Nueva suscripción
        </Button>
      </div>

      <div className="mt-8">
        <DataTable columns={columns} rows={suscripciones} loading={loading} keyExtractor={(s) => s.id} />
      </div>

      {/* Modal nueva suscripción */}
      <Modal isOpen={nueva.isOpen} onClose={nueva.close} title="Nueva suscripción">
        <div className="flex flex-col gap-4">
          <Select
            label="Socio"
            placeholder="Elegí un socio"
            options={usuarios.map((u) => ({ value: u.id, label: `${u.nombre} ${u.apellido} (${u.dni ?? u.email})` }))}
            value={formNueva.usuarioId}
            onChange={(e) => setFormNueva({ ...formNueva, usuarioId: e.target.value })}
          />
          <Select
            label="Plan"
            placeholder="Elegí un plan"
            options={planes.map((p) => ({ value: p.id, label: `${p.nombre} — $${p.precio}` }))}
            value={formNueva.planId}
            onChange={(e) => setFormNueva({ ...formNueva, planId: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={nueva.close}>Cancelar</Button>
            <Button onClick={crearSuscripcion} disabled={procesando || !formNueva.usuarioId || !formNueva.planId}>
              {procesando ? 'Creando...' : 'Crear'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal registrar pago */}
      <Modal isOpen={pago.isOpen} onClose={pago.close} title="Registrar pago">
        <div className="flex flex-col gap-4">
          {subPago && (
            <p className="text-sm text-muted">
              Socio: <span className="text-on-surface font-semibold">{subPago.usuario?.nombre} {subPago.usuario?.apellido}</span>
              {' · '}Plan: {subPago.plan?.nombre}
            </p>
          )}
          <Input label="Monto" type="number" value={formPago.monto} onChange={(e) => setFormPago({ ...formPago, monto: e.target.value })} />
          <Select
            label="Método"
            options={METODOS_PAGO}
            value={formPago.metodo}
            onChange={(e) => setFormPago({ ...formPago, metodo: e.target.value as MetodoPago })}
          />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={pago.close}>Cancelar</Button>
            <Button onClick={registrarPago} disabled={procesando}>
              {procesando ? 'Registrando...' : 'Registrar pago'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
