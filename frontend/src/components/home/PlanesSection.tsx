import { Link } from 'react-router-dom';
import { Check, Infinity as InfinityIcon } from 'lucide-react';
import { SectionTitle, Button, Chip } from '../ui';
import { usePlanes } from '../../hooks/usePlanes';
import { formatPrecio } from '../../utils/date.helpers';

export const PlanesSection = () => {
  const { planes, loading } = usePlanes();

  return (
    <section className="border-t border-outline bg-graphite">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
        <SectionTitle kicker="Sumate">Planes y membresías</SectionTitle>
        <p className="mt-4 max-w-2xl text-muted">
          Elegí el plan que se adapta a tu ritmo. Todos con acceso completo a las instalaciones.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-surface-card border border-outline animate-pulse" />
              ))
            : planes.map((plan) => {
                const destacado = plan.destacado;
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col border p-8 transition-all duration-500 ${
                      destacado
                        ? 'border-volt bg-volt/5 lg:-translate-y-4'
                        : 'border-outline bg-surface-card hover:border-muted'
                    }`}
                  >
                    {destacado && (
                      <div className="absolute -top-3 left-8">
                        <Chip variant="volt">Más elegido</Chip>
                      </div>
                    )}
                    <h3 className="font-anton text-2xl uppercase tracking-wide">{plan.nombre}</h3>
                    {plan.descripcion && (
                      <p className="mt-2 text-sm text-muted">{plan.descripcion}</p>
                    )}
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="font-anton text-5xl text-volt">{formatPrecio(plan.precio)}</span>
                      <span className="text-muted text-sm">/{plan.duracionDias}d</span>
                    </div>

                    <ul className="mt-8 flex flex-col gap-3 text-sm flex-1">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-volt shrink-0" />
                        {plan.duracionDias} días de acceso
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.paseLibre ? (
                          <>
                            <InfinityIcon size={16} className="text-volt shrink-0" />
                            Clases ilimitadas
                          </>
                        ) : (
                          <>
                            <Check size={16} className="text-volt shrink-0" />
                            {plan.limiteClases} clases incluidas
                          </>
                        )}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-volt shrink-0" />
                        Acceso a todas las salas
                      </li>
                    </ul>

                    <Link to="/register" className="mt-8">
                      <Button variant={destacado ? 'primary' : 'secondary'} fullWidth>
                        Quiero este
                      </Button>
                    </Link>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};
