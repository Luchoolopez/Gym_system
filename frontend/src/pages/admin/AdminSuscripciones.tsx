import { useState } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';
import { PageTitle, Muted, Spinner, EmptyState } from '../../components/ui';
import { SocioSuscripciones } from '../../components/admin/SocioSuscripciones';
import { useAdminUsuarios } from '../../hooks/admin/useAdminUsuarios';
import { usePlanes } from '../../hooks/usePlanes';

export const AdminSuscripciones = () => {
  const [busqueda, setBusqueda] = useState('');
  const { usuarios, loading } = useAdminUsuarios({ rol: 'User', busqueda: busqueda || undefined, limit: 200 });
  const { planes } = usePlanes();
  const [expandido, setExpandido] = useState<number | null>(null);

  return (
    <div>
      <PageTitle>Suscripciones</PageTitle>
      <Muted className="mt-2">Elegí un socio para ver y gestionar su historial de suscripciones y pagos.</Muted>

      {/* Buscador de socios */}
      <div className="mt-8 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar socio por nombre, email o DNI..."
          className="w-full bg-graphite border border-outline pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-muted/50 outline-none focus:border-volt"
        />
      </div>

      {/* Lista de socios (acordeón) */}
      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : usuarios.length === 0 ? (
          <EmptyState>No se encontraron socios.</EmptyState>
        ) : (
          <div className="flex flex-col gap-2">
            {usuarios.map((socio) => {
              const abierto = expandido === socio.id;
              return (
                <div key={socio.id} className="border border-outline">
                  <button
                    onClick={() => setExpandido(abierto ? null : socio.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left bg-surface-card hover:bg-surface-card/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-volt/10 flex items-center justify-center text-volt">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-semibold">{socio.nombre} {socio.apellido}</div>
                        <div className="text-xs text-muted">{socio.dni ? `DNI ${socio.dni}` : socio.email}</div>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`text-muted transition-transform ${abierto ? 'rotate-180' : ''}`} />
                  </button>

                  {abierto && <SocioSuscripciones usuarioId={socio.id} planes={planes} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
