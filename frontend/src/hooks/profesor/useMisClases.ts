import { horarioService } from '../../services/horario.service';
import { useApiQuery } from '../useApiQuery';

export const useMisClases = (profesorId?: number) => {
  const { data: clases, loading, error, refetch } = useApiQuery(
    () => horarioService.getByProfesor(profesorId!),
    [profesorId],
    profesorId !== undefined
  );
  return { clases: clases ?? [], loading, error, refetch };
};
