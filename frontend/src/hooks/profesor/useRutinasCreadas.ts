import { rutinaService } from '../../services/rutina.service';
import { useApiQuery } from '../useApiQuery';

export const useRutinasCreadas = () => {
  const { data: rutinas, loading, error, refetch } = useApiQuery(() => rutinaService.getCreadas(), []);
  return { rutinas: rutinas ?? [], loading, error, refetch };
};
