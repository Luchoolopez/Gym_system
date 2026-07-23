import { useState, useMemo } from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import { PageTitle, Muted, Chip, Spinner, EmptyState } from '../components/ui';
import { GrillaFiltros } from '../components/horarios/GrillaFiltros';
import { useActividades } from '../hooks/useActividades';
import { useGrilla } from '../hooks/useGrilla';
import { DIAS_SEMANA, type DiaSemana } from '../types/common.types';
import { formatHora } from '../utils/date.helpers';
import type { HorarioDto } from '../types/horario.types';

export const Horarios = () => {
  const { actividades } = useActividades();
  const [actividadId, setActividadId] = useState<number | undefined>();
  const [dia, setDia] = useState<DiaSemana | undefined>();

  const { horarios, loading } = useGrilla({ actividadId, dia });

  // Agrupamos por día para mostrar la grilla ordenada
  const porDia = useMemo(() => {
    const grupos: Record<string, HorarioDto[]> = {};
    for (const h of horarios) {
      (grupos[h.dia] ??= []).push(h);
    }
    return grupos;
  }, [horarios]);

  const diasVisibles = dia ? [dia] : DIAS_SEMANA;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <PageTitle>Grilla de horarios</PageTitle>
      <Muted className="mt-2">Consultá los horarios de todas las actividades del club.</Muted>

      <div className="mt-8">
        <GrillaFiltros
          actividades={actividades}
          actividadId={actividadId}
          dia={dia}
          onActividad={setActividadId}
          onDia={setDia}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : horarios.length === 0 ? (
        <div className="mt-10">
          <EmptyState>No hay clases para los filtros seleccionados.</EmptyState>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          {diasVisibles.map((d) => {
            const clases = porDia[d];
            if (!clases || clases.length === 0) return null;
            return (
              <div key={d}>
                <h2 className="font-anton text-2xl uppercase text-volt mb-4">{d}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clases.map((h) => (
                    <div key={h.id} className="border border-outline bg-surface-card p-5 hover:border-muted transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-anton text-xl uppercase tracking-wide">{h.actividad?.nombre}</h3>
                        {h.cupo != null ? (
                          <Chip variant="neutral">Cupo {h.cupo}</Chip>
                        ) : (
                          <Chip variant="volt">Libre</Chip>
                        )}
                      </div>
                      <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="text-volt" />
                          {formatHora(h.horaInicio)} - {formatHora(h.horaFin)}
                        </span>
                        {h.profesor && (
                          <span className="flex items-center gap-2">
                            <User size={14} className="text-volt" />
                            {h.profesor.nombre} {h.profesor.apellido}
                          </span>
                        )}
                        {h.sala && (
                          <span className="flex items-center gap-2">
                            <MapPin size={14} className="text-volt" />
                            {h.sala}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
