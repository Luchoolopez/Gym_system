import { checkinService } from '../../services/checkin.service';
import { useApiQuery } from '../useApiQuery';

export const useAdminCheckIns = (fecha?: string) => {
  const { data, loading, error, refetch } = useApiQuery(
    () => checkinService.getAll(fecha),
    [fecha]
  );
  return { checkins: data?.items ?? [], totalItems: data?.totalItems ?? 0, loading, error, refetch };
};
