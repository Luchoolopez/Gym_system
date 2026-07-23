import { Dumbbell, ScanLine } from 'lucide-react';
import type { UsuarioDto } from '../../types/auth.types';

interface CredencialCardProps {
  user: UsuarioDto;
  vigente: boolean;
}

// Credencial digital: identificación del socio para el check-in en recepción
export const CredencialCard: React.FC<CredencialCardProps> = ({ user, vigente }) => (
  <div className="relative overflow-hidden border border-volt bg-gradient-to-br from-graphite to-carbon p-6">
    <div className="absolute -right-6 -top-6 opacity-[0.06]">
      <Dumbbell size={140} strokeWidth={1} />
    </div>
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-anton text-lg uppercase">
          <Dumbbell className="text-volt" size={18} />
          Forja<span className="text-volt">Gym</span>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 border ${
            vigente ? 'border-success text-success' : 'border-error text-error'
          }`}
        >
          {vigente ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      <div className="mt-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted">Socio</div>
        <div className="font-anton text-3xl uppercase mt-1">
          {user.nombre} {user.apellido}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted">DNI</div>
          <div className="font-hanken text-xl font-bold tracking-[0.15em]">{user.dni ?? '—'}</div>
        </div>
        <ScanLine className="text-volt" size={40} strokeWidth={1.2} />
      </div>
    </div>
  </div>
);
