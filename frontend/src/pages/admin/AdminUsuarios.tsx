import { useState } from 'react';
import { Plus, Pencil, Search } from 'lucide-react';
import { PageTitle, Muted, Button, Chip, Input, Select, Modal } from '../../components/ui';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { useAdminUsuarios } from '../../hooks/admin/useAdminUsuarios';
import { useDisclosure } from '../../hooks/useDisclosure';
import { usuarioService } from '../../services/usuario.service';
import { useToast } from '../../components/ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import type { UsuarioAdminDto } from '../../types/usuario.types';
import type { Rol } from '../../types/auth.types';

const roles: { value: Rol; label: string }[] = [
  { value: 'User', label: 'Socio' },
  { value: 'Profesor', label: 'Profesor' },
  { value: 'Admin', label: 'Admin' },
];

const emptyForm = { nombre: '', apellido: '', email: '', password: '', dni: '', telefono: '', rol: 'User' as Rol };

export const AdminUsuarios = () => {
  const [busqueda, setBusqueda] = useState('');
  const [rolFiltro, setRolFiltro] = useState<Rol | undefined>();
  const { usuarios, loading, refetch } = useAdminUsuarios({ busqueda: busqueda || undefined, rol: rolFiltro });
  const { isOpen, open, close } = useDisclosure();
  const { showToast } = useToast();

  const [editando, setEditando] = useState<UsuarioAdminDto | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [guardando, setGuardando] = useState(false);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(emptyForm);
    open();
  };

  const abrirEditar = (u: UsuarioAdminDto) => {
    setEditando(u);
    setForm({
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      password: '',
      dni: u.dni ?? '',
      telefono: u.telefono ?? '',
      rol: u.rol,
    });
    open();
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      if (editando) {
        await usuarioService.update(editando.id, {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          rol: form.rol,
          dni: form.dni || undefined,
          telefono: form.telefono || undefined,
          ...(form.password ? { password: form.password } : {}),
        });
        showToast('Usuario actualizado');
      } else {
        await usuarioService.create({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password,
          rol: form.rol,
          dni: form.dni || undefined,
          telefono: form.telefono || undefined,
        });
        showToast('Usuario creado');
      }
      close();
      await refetch();
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo guardar'), 'error');
    } finally {
      setGuardando(false);
    }
  };

  const columns: Column<UsuarioAdminDto>[] = [
    { header: 'Nombre', render: (u) => <span className="font-semibold">{u.nombre} {u.apellido}</span> },
    { header: 'Email', render: (u) => <span className="text-muted">{u.email}</span> },
    { header: 'DNI', render: (u) => <span className="text-muted">{u.dni ?? '—'}</span> },
    {
      header: 'Rol',
      render: (u) => (
        <Chip variant={u.rol === 'Admin' ? 'volt' : u.rol === 'Profesor' ? 'warning' : 'neutral'}>
          {u.rol === 'User' ? 'Socio' : u.rol}
        </Chip>
      ),
    },
    { header: 'Estado', render: (u) => <Chip variant={u.activo ? 'success' : 'neutral'}>{u.activo ? 'Activo' : 'Baja'}</Chip> },
    {
      header: '',
      className: 'text-right',
      render: (u) => (
        <button onClick={() => abrirEditar(u)} className="text-muted hover:text-volt" aria-label="Editar">
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <PageTitle>Usuarios</PageTitle>
          <Muted className="mt-2">Gestioná socios, profesores y administradores.</Muted>
        </div>
        <Button onClick={abrirNuevo}>
          <Plus size={16} /> Nuevo usuario
        </Button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, email o DNI..."
            className="w-full bg-graphite border border-outline pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-muted/50 outline-none focus:border-volt"
          />
        </div>
        <div className="sm:w-52 shrink-0">
          <Select
            options={roles}
            placeholder="Todos los roles"
            value={rolFiltro ?? ''}
            onChange={(e) => setRolFiltro((e.target.value as Rol) || undefined)}
          />
        </div>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={usuarios} loading={loading} keyExtractor={(u) => u.id} />
      </div>

      <Modal isOpen={isOpen} onClose={close} title={editando ? 'Editar usuario' : 'Nuevo usuario'}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input
            label={editando ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="DNI" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} />
            <Input label="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </div>
          <Select
            label="Rol"
            options={roles}
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value as Rol })}
          />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button onClick={handleGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
