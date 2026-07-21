import { planService } from '../services/plan.service';
import { useApiQuery } from './useApiQuery';

export const usePlanes = () => {
  const { data: planes, loading, error, refetch } = useApiQuery(() => planService.getAll(), []);
  return { planes: planes ?? [], loading, error, refetch };
};
