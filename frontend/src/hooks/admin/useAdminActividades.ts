import { actividadService } from '../../services/actividad.service';
import { useApiQuery } from '../useApiQuery';

export const useAdminActividades = () => {
  const { data: actividades, loading, error, refetch } = useApiQuery(() => actividadService.getAll(true), []);
  return { actividades: actividades ?? [], loading, error, refetch };
};
