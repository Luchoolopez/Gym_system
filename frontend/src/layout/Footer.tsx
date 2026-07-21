import { Dumbbell } from 'lucide-react';

export const Footer = () => (
  <footer className="border-t border-outline bg-graphite">
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2 font-anton text-lg uppercase tracking-wide">
        <Dumbbell className="text-volt" size={18} />
        Forja<span className="text-volt">Gym</span>
      </div>
      <p className="text-muted text-xs uppercase tracking-[0.2em]">
        Entrená fuerte. Viví mejor.
      </p>
      <p className="text-muted text-xs">
        © {new Date().getFullYear()} Forja Gym — Todos los derechos reservados
      </p>
    </div>
  </footer>
);
