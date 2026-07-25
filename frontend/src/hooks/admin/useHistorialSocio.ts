import { suscripcionService } from '../../services/suscripcion.service';
import { useApiQuery } from '../useApiQuery';

// Historial de suscripciones (con sus pagos) de un socio. Se carga sólo cuando enabled=true.
export const useHistorialSocio = (userId?: number, enabled = true) => {
  const { data, loading, error, refetch } = useApiQuery(
    () => suscripcionService.getHistorialUsuario(userId!),
    [userId],
    enabled && userId !== undefined
  );
  return { historial: data ?? [], loading, error, refetch };
};
