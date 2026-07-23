import { useState, type FormEvent } from 'react';
import { Pencil } from 'lucide-react';
import { PageTitle, Muted, SectionTitle, Input, Button, Spinner } from '../components/ui';
import { CredencialCard } from '../components/perfil/CredencialCard';
import { SuscripcionCard } from '../components/perfil/SuscripcionCard';
import { StatsResumen } from '../components/perfil/StatsResumen';
import { RutinasPanel } from '../components/perfil/RutinasPanel';
import { useAuthContext } from '../context/authContext';
import { useMiSuscripcion } from '../hooks/useMiSuscripcion';
import { useMisEstadisticas } from '../hooks/useMisEstadisticas';
import { useMisRutinas } from '../hooks/useMisRutinas';
import { usuarioService } from '../services/usuario.service';
import { useToast } from '../components/ui/toast';
import { extractErrorMessage } from '../utils/api.helpers';

export const Perfil = () => {
  const { user, refreshUser } = useAuthContext();
  const { suscripcion, loading: loadingSub } = useMiSuscripcion();
  const { stats } = useMisEstadisticas();
  const { rutinas } = useMisRutinas();
  const { showToast } = useToast();

  const datosDelUsuario = () => ({
    nombre: user?.nombre ?? '',
    apellido: user?.apellido ?? '',
    telefono: user?.telefono ?? '',
    dni: user?.dni ?? '',
  });

  const [form, setForm] = useState(datosDelUsuario);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  if (!user) return <Spinner />;

  const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const cancelarEdicion = () => {
    setForm(datosDelUsuario()); // descarta los cambios
    setEditando(false);
  };

  const handleGuardar = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await usuarioService.updatePerfil({
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono || undefined,
        dni: form.dni || undefined,
      });
      await refreshUser();
      showToast('Perfil actualizado');
      setEditando(false);
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo actualizar'), 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <PageTitle>Mi perfil</PageTitle>
      <Muted className="mt-2">Tu credencial, membresía, progreso y rutinas.</Muted>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: credencial + suscripción + stats */}
        <div className="flex flex-col gap-6">
          <CredencialCard user={user} vigente={suscripcion?.vigente ?? false} />
          {!loadingSub && <SuscripcionCard suscripcion={suscripcion} />}
          <StatsResumen stats={stats} />
        </div>

        {/* Columna central/derecha: rutinas + datos */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          <div>
            <SectionTitle className="mb-4"><span className="text-2xl">Mis rutinas</span></SectionTitle>
            <RutinasPanel rutinas={rutinas} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle><span className="text-2xl">Mis datos</span></SectionTitle>
              {!editando && (
                <Button variant="secondary" size="sm" onClick={() => setEditando(true)}>
                  <Pencil size={14} /> Editar
                </Button>
              )}
            </div>
            <form onSubmit={handleGuardar} className="border border-outline bg-surface-card p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nombre" value={form.nombre} onChange={setField('nombre')} disabled={!editando} />
                <Input label="Apellido" value={form.apellido} onChange={setField('apellido')} disabled={!editando} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="DNI" value={form.dni} onChange={setField('dni')} disabled={!editando} />
                <Input label="Teléfono" value={form.telefono} onChange={setField('telefono')} disabled={!editando} />
              </div>
              {editando && (
                <div className="flex gap-3">
                  <Button type="submit" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={cancelarEdicion} disabled={guardando}>
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
