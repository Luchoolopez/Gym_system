import { cierreService } from '../../services/cierre.service';
import { useApiQuery } from '../useApiQuery';

export const useCierres = () => {
  const { data, loading, error, refetch } = useApiQuery(() => cierreService.getAll(), []);
  return { cierres: data?.items ?? [], loading, error, refetch };
};
