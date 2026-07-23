import type { ActividadDto } from '../../types/actividad.types';
import type { DiaSemana } from '../../types/common.types';
import { DIAS_SEMANA } from '../../types/common.types';

interface GrillaFiltrosProps {
  actividades: ActividadDto[];
  actividadId?: number;
  dia?: DiaSemana;
  onActividad: (id?: number) => void;
  onDia: (dia?: DiaSemana) => void;
}

const chipBase =
  'px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] border transition-colors duration-300 whitespace-nowrap';

export const GrillaFiltros: React.FC<GrillaFiltrosProps> = ({ actividades, actividadId, dia, onActividad, onDia }) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        className={`${chipBase} ${dia === undefined ? 'border-volt text-volt bg-volt/5' : 'border-outline text-muted hover:text-on-surface'}`}
        onClick={() => onDia(undefined)}
      >
        Toda la semana
      </button>
      {DIAS_SEMANA.map((d) => (
        <button
          key={d}
          className={`${chipBase} ${dia === d ? 'border-volt text-volt bg-volt/5' : 'border-outline text-muted hover:text-on-surface'}`}
          onClick={() => onDia(d)}
        >
          {d}
        </button>
      ))}
    </div>

    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        className={`${chipBase} ${actividadId === undefined ? 'border-volt text-volt bg-volt/5' : 'border-outline text-muted hover:text-on-surface'}`}
        onClick={() => onActividad(undefined)}
      >
        Todas
      </button>
      {actividades.map((a) => (
        <button
          key={a.id}
          className={`${chipBase} ${actividadId === a.id ? 'border-volt text-volt bg-volt/5' : 'border-outline text-muted hover:text-on-surface'}`}
          onClick={() => onActividad(a.id)}
        >
          {a.nombre}
        </button>
      ))}
    </div>
  </div>
);
