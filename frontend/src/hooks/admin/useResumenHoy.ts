import { cierreService } from '../../services/cierre.service';
import { useApiQuery } from '../useApiQuery';

export const useResumenHoy = () => {
  const { data: resumen, loading, error, refetch } = useApiQuery(() => cierreService.getResumenHoy(), []);
  return { resumen, loading, error, refetch };
};
