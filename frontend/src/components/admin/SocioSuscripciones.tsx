import { useState } from 'react';
import { Plus, Pencil, DollarSign, RefreshCw, XCircle, CalendarClock, Infinity as InfinityIcon } from 'lucide-react';
import { Button, Chip, Input, Select, Modal, Spinner, EmptyState } from '../ui';
import { useHistorialSocio } from '../../hooks/admin/useHistorialSocio';
import { suscripcionService } from '../../services/suscripcion.service';
import { pagoService } from '../../services/pago.service';
import { useToast } from '../ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import { formatFechaCorta, formatPrecio } from '../../utils/date.helpers';
import { METODOS_PAGO, type MetodoPago } from '../../types/pago.types';
import type { PlanDto } from '../../types/plan.types';
import type { SuscripcionDto, PagoResumenDto } from '../../types/suscripcion.types';

const estadoChip = {
  PAID: { label: 'Pagada', variant: 'success' as const },
  PENDING: { label: 'Pendiente', variant: 'warning' as const },
  CANCELLED: { label: 'Cancelada', variant: 'neutral' as const },
};

type Accion =
  | { tipo: 'nuevaSub' }
  | { tipo: 'editSub'; sub: SuscripcionDto }
  | { tipo: 'pago'; sub: SuscripcionDto }
  | { tipo: 'editPago'; sub: SuscripcionDto; pago: PagoResumenDto }
  | null;

interface SocioSuscripcionesProps {
  usuarioId: number;
  planes: PlanDto[];
}

export const SocioSuscripciones: React.FC<SocioSuscripcionesProps> = ({ usuarioId, planes }) => {
  const { historial, loading, refetch } = useHistorialSocio(usuarioId);
  const { showToast } = useToast();
  const [accion, setAccion] = useState<Accion>(null);
  const [procesando, setProcesando] = useState(false);

  // Estados de formularios (se setean al abrir cada modal)
  const [planId, setPlanId] = useState('');
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState<MetodoPago>('CASH');

  const cerrar = () => setAccion(null);

  const abrirNuevaSub = () => { setPlanId(''); setAccion({ tipo: 'nuevaSub' }); };
  const abrirEditSub = (sub: SuscripcionDto) => { setPlanId(String(sub.plan?.id ?? '')); setAccion({ tipo: 'editSub', sub }); };
  const abrirPago = (sub: SuscripcionDto) => { setMonto(String(sub.plan?.precio ?? '')); setMetodo('CASH'); setAccion({ tipo: 'pago', sub }); };
  const abrirEditPago = (sub: SuscripcionDto, pago: PagoResumenDto) => { setMonto(String(pago.monto)); setMetodo(pago.metodo); setAccion({ tipo: 'editPago', sub, pago }); };

  const run = async (fn: () => Promise<unknown>, okMsg: string) => {
    setProcesando(true);
    try {
      await fn();
      showToast(okMsg);
      cerrar();
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo completar la acción'), 'error');
    } finally {
      setProcesando(false);
    }
  };

  const cancelarSub = async (sub: SuscripcionDto) => {
    if (!confirm('¿Cancelar esta suscripción?')) return;
    await run(() => suscripcionService.cancelar(sub.id), 'Suscripción cancelada');
  };

  const renovarSub = async (sub: SuscripcionDto) => {
    if (!confirm('¿Renovar esta suscripción?')) return;
    await run(() => suscripcionService.renovar(sub.id), 'Suscripción renovada');
  };

  const planOptions = planes.map((p) => ({ value: p.id, label: `${p.nombre} — ${formatPrecio(p.precio)}` }));

  return (
    <div className="border-t border-outline bg-graphite/50 p-5">
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={abrirNuevaSub}>
          <Plus size={14} /> Nueva suscripción
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : historial.length === 0 ? (
        <EmptyState>Este socio todavía no tiene suscripciones.</EmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {historial.map((sub) => (
            <div key={sub.id} className="border border-outline bg-surface-card p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-anton text-lg uppercase">{sub.plan?.nombre ?? 'Plan'}</h4>
                    <Chip variant={estadoChip[sub.estadoPago].variant}>{estadoChip[sub.estadoPago].label}</Chip>
                    {sub.vigente && <Chip variant="volt">Vigente</Chip>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1 capitalize">
                      <CalendarClock size={12} className="text-volt" />
                      {formatFechaCorta(sub.fechaInicio)} → {formatFechaCorta(sub.fechaFin)}
                    </span>
                    <span className="flex items-center gap-1">
                      {sub.clasesRestantes == null ? (
                        <><InfinityIcon size={12} className="text-volt" /> Clases libres</>
                      ) : (
                        <>Clases restantes: {sub.clasesRestantes}</>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sub.estadoPago === 'PENDING' && (
                    <Button size="sm" onClick={() => abrirPago(sub)}>
                      <DollarSign size={13} /> Pago
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => abrirEditSub(sub)}>
                    <Pencil size={13} /> Plan
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => renovarSub(sub)}>
                    <RefreshCw size={13} /> Renovar
                  </Button>
                  {sub.estadoPago !== 'CANCELLED' && (
                    <Button size="sm" variant="danger" onClick={() => cancelarSub(sub)}>
                      <XCircle size={13} /> Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* Pagos de la suscripción */}
              {sub.pagos && sub.pagos.length > 0 && (
                <div className="mt-3 border-t border-outline pt-3">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-muted mb-2">Pagos</div>
                  <div className="flex flex-col gap-1.5">
                    {sub.pagos.map((pago) => (
                      <div key={pago.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-success font-semibold">{formatPrecio(pago.monto)}</span>
                          <Chip variant="neutral">{pago.metodoLabel}</Chip>
                          <span className="text-xs text-muted capitalize">{formatFechaCorta(pago.fecha)}</span>
                        </span>
                        <button onClick={() => abrirEditPago(sub, pago)} className="text-muted hover:text-volt" title="Editar pago">
                          <Pencil size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: nueva suscripción */}
      <Modal isOpen={accion?.tipo === 'nuevaSub'} onClose={cerrar} title="Nueva suscripción">
        <div className="flex flex-col gap-4">
          <Select label="Plan" placeholder="Elegí un plan" options={planOptions} value={planId} onChange={(e) => setPlanId(e.target.value)} />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={cerrar}>Cancelar</Button>
            <Button
              disabled={procesando || !planId}
              onClick={() => run(() => suscripcionService.create({ usuarioId, planId: Number(planId) }), 'Suscripción creada')}
            >
              {procesando ? 'Creando...' : 'Crear'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: editar plan de la suscripción */}
      <Modal isOpen={accion?.tipo === 'editSub'} onClose={cerrar} title="Cambiar plan">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-muted">Al cambiar el plan se recalcula la fecha de vencimiento según la duración del nuevo plan.</p>
          <Select label="Plan" options={planOptions} value={planId} onChange={(e) => setPlanId(e.target.value)} />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={cerrar}>Cancelar</Button>
            <Button
              disabled={procesando || !planId}
              onClick={() => accion?.tipo === 'editSub' && run(() => suscripcionService.update(accion.sub.id, { planId: Number(planId) }), 'Plan actualizado')}
            >
              {procesando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: registrar pago */}
      <Modal isOpen={accion?.tipo === 'pago'} onClose={cerrar} title="Registrar pago">
        <div className="flex flex-col gap-4">
          <Input label="Monto" type="number" value={monto} onChange={(e) => setMonto(e.target.value)} />
          <Select label="Método" options={METODOS_PAGO} value={metodo} onChange={(e) => setMetodo(e.target.value as MetodoPago)} />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={cerrar}>Cancelar</Button>
            <Button
              disabled={procesando || !monto}
              onClick={() => accion?.tipo === 'pago' && run(() => pagoService.create({ suscripcionId: accion.sub.id, monto: Number(monto), metodo }), 'Pago registrado')}
            >
              {procesando ? 'Registrando...' : 'Registrar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: editar pago (método / monto) */}
      <Modal isOpen={accion?.tipo === 'editPago'} onClose={cerrar} title="Editar pago">
        <div className="flex flex-col gap-4">
          <Input label="Monto" type="number" value={monto} onChange={(e) => setMonto(e.target.value)} />
          <Select label="Método" options={METODOS_PAGO} value={metodo} onChange={(e) => setMetodo(e.target.value as MetodoPago)} />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={cerrar}>Cancelar</Button>
            <Button
              disabled={procesando || !monto}
              onClick={() => accion?.tipo === 'editPago' && run(() => pagoService.update(accion.pago.id, { monto: Number(monto), metodo }), 'Pago actualizado')}
            >
              {procesando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
