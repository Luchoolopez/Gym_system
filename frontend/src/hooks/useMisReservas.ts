import { reservaService } from '../services/reserva.service';
import { useApiQuery } from './useApiQuery';

export const useMisReservas = () => {
  const { data: reservas, loading, error, refetch } = useApiQuery(() => reservaService.getMias(), []);
  return { reservas: reservas ?? [], loading, error, refetch };
};
