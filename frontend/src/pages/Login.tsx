import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { Input, Button, PageTitle, Muted } from '../components/ui';
import { useAuthContext } from '../context/authContext';

export const Login = () => {
  const { login, loading, error } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form);
      // Redirigimos según el rol
      if (res.usuario.rol === 'Admin') navigate('/admin');
      else if (res.usuario.rol === 'Profesor') navigate('/profesor');
      else navigate('/reservas');
    } catch {
      // el error ya se muestra desde el context
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="flex items-center gap-2 font-anton text-2xl uppercase justify-center mb-8">
        <Dumbbell className="text-volt" size={26} />
        Forja<span className="text-volt">Gym</span>
      </div>
      <PageTitle className="text-center">Ingresá a tu cuenta</PageTitle>
      <Muted className="text-center mt-2">Entrená, reservá y seguí tu progreso.</Muted>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="tu@email.com"
          required
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          required
        />

        {error && <p className="text-error text-sm">{error}</p>}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿No tenés cuenta?{' '}
        <Link to="/register" className="text-volt font-semibold hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
};
