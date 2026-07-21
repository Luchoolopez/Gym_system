import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Dumbbell } from 'lucide-react';
import { useAuthContext } from '../context/authContext';

const linkBase = 'text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-300';
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `${linkBase} ${isActive ? 'text-volt' : 'text-on-surface hover:text-volt'}`;

export const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const links = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setMobileOpen(false)} end>
        Inicio
      </NavLink>
      <NavLink to="/horarios" className={linkClass} onClick={() => setMobileOpen(false)}>
        Horarios
      </NavLink>
      {user && (
        <NavLink to="/reservas" className={linkClass} onClick={() => setMobileOpen(false)}>
          Reservas
        </NavLink>
      )}
      {user && (
        <NavLink to="/perfil" className={linkClass} onClick={() => setMobileOpen(false)}>
          Mi Perfil
        </NavLink>
      )}
      {user && (user.rol === 'Profesor' || user.rol === 'Admin') && (
        <NavLink to="/profesor" className={linkClass} onClick={() => setMobileOpen(false)}>
          Panel Profesor
        </NavLink>
      )}
      {user?.rol === 'Admin' && (
        <NavLink to="/admin" className={linkClass} onClick={() => setMobileOpen(false)}>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-outline bg-carbon/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 font-anton text-xl uppercase tracking-wide">
          <Dumbbell className="text-volt" size={22} />
          Forja<span className="text-volt">Gym</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">{links}</div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-xs text-muted">
                Hola, <span className="text-on-surface font-semibold">{user.nombre}</span>
              </span>
              <button onClick={handleLogout} className={`${linkBase} text-muted hover:text-error`}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${linkBase} text-on-surface hover:text-volt`}>
                Ingresar
              </Link>
              <Link
                to="/register"
                className="bg-volt text-carbon px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] border border-volt hover:bg-transparent hover:text-volt transition-all duration-300"
              >
                Sumate
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-on-surface" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menú">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-outline bg-carbon px-6 py-6 flex flex-col gap-5">
          {links}
          {user ? (
            <button onClick={handleLogout} className={`${linkBase} text-left text-muted hover:text-error`}>
              Salir
            </button>
          ) : (
            <>
              <Link to="/login" className={`${linkBase} text-on-surface`} onClick={() => setMobileOpen(false)}>
                Ingresar
              </Link>
              <Link to="/register" className={`${linkBase} text-volt`} onClick={() => setMobileOpen(false)}>
                Sumate
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
