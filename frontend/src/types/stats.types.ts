export interface MisEstadisticasDto {
  asistenciasPorMes: { mes: string; total: number }[];
  totalAsistencias: number;
  totalReservas: number;
  reservasAsistidas: number;
  reservasCanceladas: number;
  suscripcion: {
    plan?: string;
    fechaFin: string;
    clasesRestantes: number | null;
  } | null;
  fecha: string;
}

export interface DashboardDto {
  sociosActivos: number;
  pagosPendientes: number;
  suscripcionesPorVencer: number;
  ingresosMes: number;
  checkinsHoy: number;
  reservasHoy: number;
  fecha: string;
}
