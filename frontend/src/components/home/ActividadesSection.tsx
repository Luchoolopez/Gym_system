import { Dumbbell, Bike, HeartPulse, Zap, Users, Activity } from 'lucide-react';
import { SectionTitle } from '../ui';
import { useActividades } from '../../hooks/useActividades';

// Íconos por nombre de actividad; fallback genérico
const iconoPorActividad = (nombre: string) => {
  const n = nombre.toLowerCase();
  if (n.includes('muscul')) return Dumbbell;
  if (n.includes('spin') || n.includes('bike') || n.includes('ciclis')) return Bike;
  if (n.includes('funcional')) return Zap;
  if (n.includes('cardio')) return HeartPulse;
  if (n.includes('grupal') || n.includes('clase')) return Users;
  return Activity;
};

export const ActividadesSection = () => {
  const { actividades, loading } = useActividades();

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
      <SectionTitle kicker="Lo que hacemos">Actividades</SectionTitle>
      <p className="mt-4 max-w-2xl text-muted">
        Elegí tu disciplina. Cada clase está pensada para llevarte al límite y sacar lo mejor de vos.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 bg-surface-card border border-outline animate-pulse" />
            ))
          : actividades.map((act) => {
              const Icono = iconoPorActividad(act.nombre);
              return (
                <div
                  key={act.id}
                  className="group relative overflow-hidden border border-outline bg-surface-card p-8 transition-all duration-500 hover:border-volt"
                >
                  <Icono className="text-volt mb-6" size={32} strokeWidth={1.5} />
                  <h3 className="font-anton text-2xl uppercase tracking-wide">{act.nombre}</h3>
                  {act.descripcion && (
                    <p className="mt-2 text-sm text-muted leading-relaxed">{act.descripcion}</p>
                  )}
                  <div className="absolute -right-8 -bottom-8 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]">
                    <Icono size={140} strokeWidth={1} />
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
};
