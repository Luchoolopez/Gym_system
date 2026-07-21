import { pagoService } from '../../services/pago.service';
import { useApiQuery } from '../useApiQuery';
import type { PagoFilterDto } from '../../types/pago.types';

export const useAdminPagos = (filtros?: PagoFilterDto) => {
  const { data, loading, error, refetch } = useApiQuery(
    () => pagoService.getAll(filtros),
    [filtros?.page, filtros?.limit, filtros?.usuarioId, filtros?.desde, filtros?.hasta]
  );
  return { pagos: data?.items ?? [], totalItems: data?.totalItems ?? 0, loading, error, refetch };
};
