import { pagoService } from '../services/pago.service';
import { useApiQuery } from './useApiQuery';

export const useMisPagos = () => {
  const { data: pagos, loading, error, refetch } = useApiQuery(() => pagoService.getMios(), []);
  return { pagos: pagos ?? [], loading, error, refetch };
};
