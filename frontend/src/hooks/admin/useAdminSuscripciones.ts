import { suscripcionService } from '../../services/suscripcion.service';
import { useApiQuery } from '../useApiQuery';
import type { SuscripcionFilterDto } from '../../types/suscripcion.types';

export const useAdminSuscripciones = (filtros?: SuscripcionFilterDto) => {
  const { data, loading, error, refetch } = useApiQuery(
    () => suscripcionService.getAll(filtros),
    [filtros?.page, filtros?.limit, filtros?.estadoPago, filtros?.vigentes]
  );
  return { suscripciones: data?.items ?? [], totalItems: data?.totalItems ?? 0, loading, error, refetch };
};
