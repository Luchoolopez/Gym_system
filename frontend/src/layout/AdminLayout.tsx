import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, CalendarClock, ScanLine, Dumbbell, ArrowLeft, Tags } from 'lucide-react';

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.14em] border-l-2 transition-colors duration-300 ${
    isActive ? 'border-volt text-volt bg-volt/5' : 'border-transparent text-muted hover:text-on-surface'
  }`;

export const AdminLayout = () => (
  <div className="flex min-h-screen">
    <aside className="hidden md:flex w-60 flex-col border-r border-outline bg-graphite">
      <Link to="/" className="flex items-center gap-2 font-anton text-lg uppercase tracking-wide px-5 h-16 border-b border-outline">
        <Dumbbell className="text-volt" size={20} />
        Forja<span className="text-volt">Gym</span>
      </Link>
      <nav className="flex flex-col py-6 gap-1">
        <NavLink to="/admin" end className={itemClass}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/admin/checkin" className={itemClass}>
          <ScanLine size={16} /> Check-in
        </NavLink>
        <NavLink to="/admin/usuarios" className={itemClass}>
          <Users size={16} /> Usuarios
        </NavLink>
        <NavLink to="/admin/suscripciones" className={itemClass}>
          <CreditCard size={16} /> Suscripciones
        </NavLink>
        <NavLink to="/admin/planes" className={itemClass}>
          <Tags size={16} /> Planes
        </NavLink>
        <NavLink to="/admin/horarios" className={itemClass}>
          <CalendarClock size={16} /> Horarios
        </NavLink>
      </nav>
      <Link to="/" className="mt-auto flex items-center gap-2 px-5 py-4 text-[11px] uppercase tracking-[0.14em] text-muted hover:text-volt border-t border-outline">
        <ArrowLeft size={14} /> Volver al sitio
      </Link>
    </aside>

    <div className="flex-1 flex flex-col min-w-0">
      {/* Barra superior en mobile */}
      <div className="md:hidden flex items-center gap-4 overflow-x-auto scrollbar-hide border-b border-outline bg-graphite px-4 h-14">
        {[
          { to: '/admin', label: 'Dashboard', end: true },
          { to: '/admin/checkin', label: 'Check-in' },
          { to: '/admin/usuarios', label: 'Usuarios' },
          { to: '/admin/suscripciones', label: 'Suscripciones' },
          { to: '/admin/planes', label: 'Planes' },
          { to: '/admin/horarios', label: 'Horarios' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.14em] ${isActive ? 'text-volt' : 'text-muted'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);
