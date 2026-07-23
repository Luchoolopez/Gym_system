import { useState, type FormEvent } from 'react';
import { ScanLine, CheckCircle2, Clock } from 'lucide-react';
import { PageTitle, Muted, Input, Button, Chip } from '../../components/ui';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { useAdminCheckIns } from '../../hooks/admin/useAdminCheckIns';
import { checkinService } from '../../services/checkin.service';
import { useToast } from '../../components/ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import type { CheckInDto } from '../../types/checkin.types';

export const AdminCheckIn = () => {
  const { checkins, refetch } = useAdminCheckIns();
  const { showToast } = useToast();
  const [dni, setDni] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [ultimo, setUltimo] = useState<CheckInDto | null>(null);

  const handleCheckIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;
    setRegistrando(true);
    try {
      const res = await checkinService.create({ dni: dni.trim() });
      setUltimo(res);
      const nombre = res.usuario ? `${res.usuario.nombre} ${res.usuario.apellido}` : 'Socio';
      showToast(`Acceso registrado: ${nombre}`);
      setDni('');
      await refetch();
    } catch (err) {
      setUltimo(null);
      showToast(extractErrorMessage(err, 'No se pudo registrar el acceso'), 'error');
    } finally {
      setRegistrando(false);
    }
  };

  const columns: Column<CheckInDto>[] = [
    {
      header: 'Socio',
      render: (c) => (
        <span className="font-semibold">
          {c.usuario ? `${c.usuario.nombre} ${c.usuario.apellido}` : '—'}
        </span>
      ),
    },
    { header: 'DNI', render: (c) => <span className="text-muted">{c.usuario?.dni ?? '—'}</span> },
    {
      header: 'Hora',
      render: (c) => (
        <span className="flex items-center gap-1 text-muted">
          <Clock size={13} />
          {new Date(c.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageTitle>Control de acceso</PageTitle>
      <Muted className="mt-2">Registrá la entrada de los socios por DNI (credencial).</Muted>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Escáner / registro */}
        <div>
          <div className="border border-volt bg-volt/5 p-6">
            <form onSubmit={handleCheckIn} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-volt">
                <ScanLine size={22} />
                <h3 className="font-anton text-xl uppercase">Registrar acceso</h3>
              </div>
              <Input
                label="DNI del socio"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej: 40111222"
                autoFocus
              />
              <Button type="submit" fullWidth disabled={registrando}>
                {registrando ? 'Registrando...' : 'Registrar entrada'}
              </Button>
            </form>
          </div>

          {ultimo && (
            <div className="mt-4 border border-success/40 bg-success/10 p-5">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 size={20} />
                <span className="font-anton text-lg uppercase">Acceso permitido</span>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-semibold">
                  {ultimo.usuario?.nombre} {ultimo.usuario?.apellido}
                </span>
                {ultimo.clasesRestantes != null && (
                  <span className="ml-2 text-muted">· Clases restantes: {ultimo.clasesRestantes}</span>
                )}
                {ultimo.reservaAsistida && <Chip variant="success" className="ml-2">Reserva marcada</Chip>}
              </div>
            </div>
          )}
        </div>

        {/* Accesos de hoy */}
        <div>
          <h3 className="font-anton text-xl uppercase mb-4">Accesos de hoy</h3>
          <DataTable
            columns={columns}
            rows={checkins}
            emptyMessage="Todavía no hay accesos registrados hoy."
            keyExtractor={(c) => c.id}
          />
        </div>
      </div>
    </div>
  );
};
