import { horarioService } from '../services/horario.service';
import { useApiQuery } from './useApiQuery';
import type { HorarioFilterDto } from '../types/horario.types';

export const useGrilla = (filtros?: HorarioFilterDto) => {
  const { data: horarios, loading, error, refetch } = useApiQuery(
    () => horarioService.getGrilla(filtros),
    [filtros?.actividadId, filtros?.dia]
  );
  return { horarios: horarios ?? [], loading, error, refetch };
};
