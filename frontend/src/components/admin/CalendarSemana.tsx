import { Clock, MapPin, Users, Infinity as InfinityIcon } from 'lucide-react';
import { formatHora, formatDiaMes, diaDeLaSemana, hoyStr } from '../../utils/date.helpers';
import type { HorarioDto } from '../../types/horario.types';
import type { ClaseDelDiaDto } from '../../types/reserva.types';

interface CalendarSemanaProps {
  horarios: HorarioDto[];
  fechas: string[]; // 7 fechas Lun→Dom
  ocupacion: Map<string, ClaseDelDiaDto>;
  onSelectClase: (horario: HorarioDto, fecha: string) => void;
}

// Color del contador de cupo según ocupación
const cupoColor = (reservados: number, cupo: number | null) => {
  if (cupo == null) return 'text-volt';
  const ratio = reservados / cupo;
  if (ratio >= 1) return 'text-error';
  if (ratio >= 0.7) return 'text-warning';
  return 'text-success';
};

export const CalendarSemana: React.FC<CalendarSemanaProps> = ({ horarios, fechas, ocupacion, onSelectClase }) => {
  const hoy = hoyStr();

  // Agrupamos los horarios (template semanal) por día de la semana
  const porDia: Record<string, HorarioDto[]> = {};
  for (const h of horarios) {
    (porDia[h.dia] ??= []).push(h);
  }
  for (const dia of Object.keys(porDia)) {
    porDia[dia].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {fechas.map((fecha) => {
        const dia = diaDeLaSemana(fecha);
        const clasesDelDia = porDia[dia] ?? [];
        const esHoy = fecha === hoy;

        return (
          <div key={fecha} className="flex flex-col">
            {/* Encabezado del día */}
            <div className={`border-b-2 pb-2 mb-3 ${esHoy ? 'border-volt' : 'border-outline'}`}>
              <div className={`font-anton text-sm uppercase ${esHoy ? 'text-volt' : 'text-on-surface'}`}>{dia}</div>
              <div className="text-[11px] text-muted">{formatDiaMes(fecha)}</div>
            </div>

            {/* Clases del día */}
            <div className="flex flex-col gap-2">
              {clasesDelDia.length === 0 ? (
                <div className="text-[11px] text-muted/50 py-2">—</div>
              ) : (
                clasesDelDia.map((h) => {
                  const clase = ocupacion.get(`${h.id}|${fecha}`);
                  const reservados = clase?.reservados ?? 0;
                  return (
                    <button
                      key={h.id}
                      onClick={() => onSelectClase(h, fecha)}
                      className="text-left border border-outline bg-surface-card p-2.5 hover:border-volt transition-colors group"
                    >
                      <div className="font-bold text-[13px] uppercase tracking-wide truncate group-hover:text-volt">
                        {h.actividad?.nombre}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                        <Clock size={11} /> {formatHora(h.horaInicio)}
                      </div>
                      {h.sala && (
                        <div className="flex items-center gap-1 text-[11px] text-muted">
                          <MapPin size={11} /> {h.sala}
                        </div>
                      )}
                      <div className={`mt-1.5 flex items-center gap-1 text-[11px] font-bold ${cupoColor(reservados, h.cupo)}`}>
                        {h.cupo == null ? (
                          <><InfinityIcon size={11} /> Libre</>
                        ) : (
                          <><Users size={11} /> {reservados}/{h.cupo}</>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
