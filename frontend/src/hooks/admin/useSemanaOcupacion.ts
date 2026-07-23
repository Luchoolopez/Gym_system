import { reservaService } from '../../services/reserva.service';
import { useApiQuery } from '../useApiQuery';
import type { ClaseDelDiaDto } from '../../types/reserva.types';

// Ocupación de todas las clases de una semana, indexada por `${horarioId}|${fecha}`.
// Reutiliza getClasesDelDia (una query agrupada por día en el backend) para las 7 fechas.
export const useSemanaOcupacion = (fechas: string[]) => {
  const key = fechas.join(',');

  const { data, loading, error, refetch } = useApiQuery(async () => {
    const dias = await Promise.all(fechas.map((f) => reservaService.getClasesDelDia(f)));
    const mapa = new Map<string, ClaseDelDiaDto>();
    dias.forEach((clases, i) => {
      for (const clase of clases) {
        mapa.set(`${clase.horarioId}|${fechas[i]}`, clase);
      }
    });
    return mapa;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { ocupacion: data ?? new Map<string, ClaseDelDiaDto>(), loading, error, refetch };
};
