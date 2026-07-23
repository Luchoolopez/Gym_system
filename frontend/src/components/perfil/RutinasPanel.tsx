import { useState } from 'react';
import { ClipboardList, ChevronDown } from 'lucide-react';
import { EmptyState } from '../ui';
import { formatFechaCorta } from '../../utils/date.helpers';
import type { RutinaDto } from '../../types/rutina.types';

export const RutinasPanel: React.FC<{ rutinas: RutinaDto[] }> = ({ rutinas }) => {
  const [abierta, setAbierta] = useState<number | null>(rutinas[0]?.id ?? null);

  if (rutinas.length === 0) {
    return <EmptyState>Todavía no tenés rutinas asignadas. Tu profesor te enviará una pronto.</EmptyState>;
  }

  return (
    <div className="flex flex-col gap-3">
      {rutinas.map((r) => {
        const open = abierta === r.id;
        return (
          <div key={r.id} className="border border-outline bg-surface-card">
            <button
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => setAbierta(open ? null : r.id)}
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-volt shrink-0" />
                <div>
                  <h4 className="font-anton text-lg uppercase">{r.titulo}</h4>
                  {r.profesor && (
                    <span className="text-xs text-muted">
                      Por {r.profesor.nombre} {r.profesor.apellido}
                      {r.fechaActualizacion && ` · ${formatFechaCorta(r.fechaActualizacion.slice(0, 10))}`}
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown size={18} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <div className="border-t border-outline p-4">
                <pre className="whitespace-pre-wrap font-hanken text-sm text-on-surface leading-relaxed">
                  {r.contenido}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
