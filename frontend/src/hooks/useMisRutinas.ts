import { rutinaService } from '../services/rutina.service';
import { useApiQuery } from './useApiQuery';

export const useMisRutinas = () => {
  const { data: rutinas, loading, error, refetch } = useApiQuery(() => rutinaService.getMias(), []);
  return { rutinas: rutinas ?? [], loading, error, refetch };
};
