import { useState, type FormEvent } from 'react';
import { ScanLine, CheckCircle2, Clock, Users, DollarSign, Lock } from 'lucide-react';
import { PageTitle, Muted, Input, Button, Chip, SectionTitle } from '../../components/ui';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { CierreHistorial } from '../../components/admin/CierreHistorial';
import { useAdminCheckIns } from '../../hooks/admin/useAdminCheckIns';
import { useResumenHoy } from '../../hooks/admin/useResumenHoy';
import { useCierres } from '../../hooks/admin/useCierres';
import { checkinService } from '../../services/checkin.service';
import { cierreService } from '../../services/cierre.service';
import { useToast } from '../../components/ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import { formatPrecio } from '../../utils/date.helpers';
import type { CheckInDto } from '../../types/checkin.types';

export const AdminCheckIn = () => {
  const { checkins, refetch } = useAdminCheckIns();
  const { resumen, refetch: refetchResumen } = useResumenHoy();
  const { cierres, loading: loadingCierres, refetch: refetchCierres } = useCierres();
  const { showToast } = useToast();

  const [dni, setDni] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [ultimo, setUltimo] = useState<CheckInDto | null>(null);
  const [cerrando, setCerrando] = useState(false);

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
      await Promise.all([refetch(), refetchResumen()]);
    } catch (err) {
      setUltimo(null);
      showToast(extractErrorMessage(err, 'No se pudo registrar el acceso'), 'error');
    } finally {
      setRegistrando(false);
    }
  };

  const handleCerrarCaja = async () => {
    if (!confirm('¿Cerrar la caja del día? Se registrará el total de accesos e ingresos de hoy.')) return;
    setCerrando(true);
    try {
      await cierreService.cerrarDia();
      showToast('Caja del día cerrada');
      await Promise.all([refetchResumen(), refetchCierres()]);
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo cerrar la caja'), 'error');
    } finally {
      setCerrando(false);
    }
  };

  const columns: Column<CheckInDto>[] = [
    {
      header: 'Socio',
      render: (c) => (
        <span className="font-semibold">{c.usuario ? `${c.usuario.nombre} ${c.usuario.apellido}` : '—'}</span>
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
      <Muted className="mt-2">Registrá la entrada de los socios y cerrá la caja al final del día.</Muted>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda: registrar acceso + caja del día */}
        <div className="flex flex-col gap-6">
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
            <div className="border border-success/40 bg-success/10 p-5">
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

          {/* Caja del día */}
          <div className="border border-outline bg-surface-card p-6">
            <h3 className="font-anton text-xl uppercase mb-4">Caja del día</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-outline p-4 text-center">
                <Users className="mx-auto text-volt mb-1" size={20} />
                <div className="font-anton text-3xl">{resumen?.totalCheckins ?? 0}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted">Accesos</div>
              </div>
              <div className="border border-outline p-4 text-center">
                <DollarSign className="mx-auto text-success mb-1" size={20} />
                <div className="font-anton text-3xl">{formatPrecio(resumen?.totalIngresos ?? 0)}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted">Ingresos</div>
              </div>
            </div>
            <div className="mt-4">
              {resumen?.cerrado ? (
                <div className="flex items-center justify-center gap-2 text-muted text-sm border border-outline py-3">
                  <Lock size={14} /> La caja de hoy ya está cerrada
                </div>
              ) : (
                <Button fullWidth onClick={handleCerrarCaja} disabled={cerrando}>
                  {cerrando ? 'Cerrando...' : 'Cerrar caja del día'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha: accesos de hoy */}
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

      {/* Historial de cierres */}
      <div className="mt-14">
        <SectionTitle className="mb-4"><span className="text-2xl">Cierres anteriores</span></SectionTitle>
        <CierreHistorial cierres={cierres} loading={loadingCierres} />
      </div>
    </div>
  );
};
