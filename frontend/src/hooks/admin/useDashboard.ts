import { statsService } from '../../services/stats.service';
import { useApiQuery } from '../useApiQuery';

export const useDashboard = () => {
  const { data: dashboard, loading, error, refetch } = useApiQuery(() => statsService.getDashboard(), []);
  return { dashboard, loading, error, refetch };
};
