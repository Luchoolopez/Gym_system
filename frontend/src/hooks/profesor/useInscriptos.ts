import { reservaService } from '../../services/reserva.service';
import { useApiQuery } from '../useApiQuery';

export const useInscriptos = (horarioId?: number, fecha?: string) => {
  const { data: inscriptos, loading, error, refetch } = useApiQuery(
    () => reservaService.getInscriptos(horarioId!, fecha!),
    [horarioId, fecha],
    horarioId !== undefined && fecha !== undefined
  );
  return { inscriptos, loading, error, refetch };
};
