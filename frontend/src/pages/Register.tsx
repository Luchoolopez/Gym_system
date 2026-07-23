import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { Input, Button, PageTitle, Muted } from '../components/ui';
import { useAuthContext } from '../context/authContext';

export const Register = () => {
  const { register, loading, error } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    dni: '',
    telefono: '',
  });

  const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        dni: form.dni || undefined,
        telefono: form.telefono || undefined,
      });
      navigate('/reservas');
    } catch {
      // el error ya se muestra desde el context
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="flex items-center gap-2 font-anton text-2xl uppercase justify-center mb-8">
        <Dumbbell className="text-volt" size={26} />
        Forja<span className="text-volt">Gym</span>
      </div>
      <PageTitle className="text-center">Sumate al club</PageTitle>
      <Muted className="text-center mt-2">Creá tu cuenta y empezá a entrenar.</Muted>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nombre" name="nombre" value={form.nombre} onChange={setField('nombre')} required />
          <Input label="Apellido" name="apellido" value={form.apellido} onChange={setField('apellido')} required />
        </div>
        <Input label="Email" type="email" name="email" value={form.email} onChange={setField('email')} required />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={form.password}
          onChange={setField('password')}
          placeholder="Mínimo 6 caracteres"
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="DNI (credencial)" name="dni" value={form.dni} onChange={setField('dni')} placeholder="Para el acceso" />
          <Input label="Teléfono" name="telefono" value={form.telefono} onChange={setField('telefono')} />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-volt font-semibold hover:underline">
          Ingresá
        </Link>
      </p>
    </div>
  );
};
