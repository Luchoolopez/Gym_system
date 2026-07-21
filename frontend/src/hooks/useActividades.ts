import { actividadService } from '../services/actividad.service';
import { useApiQuery } from './useApiQuery';

export const useActividades = () => {
  const { data: actividades, loading, error, refetch } = useApiQuery(() => actividadService.getAll(), []);
  return { actividades: actividades ?? [], loading, error, refetch };
};
