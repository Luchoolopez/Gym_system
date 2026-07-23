import { CreditCard, CalendarClock, Infinity as InfinityIcon } from 'lucide-react';
import { Chip, EmptyState } from '../ui';
import { formatFechaCorta } from '../../utils/date.helpers';
import type { SuscripcionDto } from '../../types/suscripcion.types';

const estadoPagoChip = {
  PAID: { label: 'Al día', variant: 'success' as const },
  PENDING: { label: 'Pago pendiente', variant: 'warning' as const },
  CANCELLED: { label: 'Cancelada', variant: 'neutral' as const },
};

export const SuscripcionCard: React.FC<{ suscripcion: SuscripcionDto | null }> = ({ suscripcion }) => {
  if (!suscripcion) {
    return <EmptyState>No tenés una suscripción activa. Contactá al club para asociarte.</EmptyState>;
  }

  const chip = estadoPagoChip[suscripcion.estadoPago];

  return (
    <div className="border border-outline bg-surface-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="text-volt" size={18} />
          <h3 className="font-anton text-xl uppercase">{suscripcion.plan?.nombre ?? 'Plan'}</h3>
        </div>
        <Chip variant={chip.variant}>{chip.label}</Chip>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted">Vence</div>
          <div className="mt-1 flex items-center gap-2 font-semibold capitalize">
            <CalendarClock size={14} className="text-volt" />
            {formatFechaCorta(suscripcion.fechaFin)}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted">Clases</div>
          <div className="mt-1 flex items-center gap-2 font-semibold">
            {suscripcion.clasesRestantes == null ? (
              <>
                <InfinityIcon size={14} className="text-volt" />
                Ilimitadas
              </>
            ) : (
              <span className="font-anton text-2xl text-volt">{suscripcion.clasesRestantes}</span>
            )}
          </div>
        </div>
      </div>

      {!suscripcion.vigente && (
        <p className="mt-4 text-xs text-error">Tu membresía no está vigente. Renovala para seguir entrenando.</p>
      )}
    </div>
  );
};
