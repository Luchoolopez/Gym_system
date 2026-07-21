import { suscripcionService } from '../services/suscripcion.service';
import { useApiQuery } from './useApiQuery';

export const useMiSuscripcion = () => {
  const { data: suscripcion, loading, error, refetch } = useApiQuery(() => suscripcionService.getMia(), []);
  return { suscripcion, loading, error, refetch };
};
