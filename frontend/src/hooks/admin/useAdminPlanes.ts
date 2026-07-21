import { planService } from '../../services/plan.service';
import { useApiQuery } from '../useApiQuery';

export const useAdminPlanes = () => {
  const { data: planes, loading, error, refetch } = useApiQuery(() => planService.getAll(true), []);
  return { planes: planes ?? [], loading, error, refetch };
};
