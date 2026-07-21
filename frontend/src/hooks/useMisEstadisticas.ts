import { statsService } from '../services/stats.service';
import { useApiQuery } from './useApiQuery';

export const useMisEstadisticas = () => {
  const { data: stats, loading, error, refetch } = useApiQuery(() => statsService.getMias(), []);
  return { stats, loading, error, refetch };
};
