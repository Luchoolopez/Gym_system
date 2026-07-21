import { reservaService } from '../services/reserva.service';
import { useApiQuery } from './useApiQuery';

export const useClasesDelDia = (fecha?: string, actividadId?: number) => {
  const { data: clases, loading, error, refetch } = useApiQuery(
    () => reservaService.getClasesDelDia(fecha, actividadId),
    [fecha, actividadId]
  );
  return { clases: clases ?? [], loading, error, refetch };
};
