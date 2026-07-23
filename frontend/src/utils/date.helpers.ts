import { DIAS_SEMANA, type DiaSemana } from '../types/common.types';

// Fecha local en formato YYYY-MM-DD
export const hoyStr = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const sumarDias = (fecha: string, dias: number): string => {
  const [y, m, d] = fecha.split('-').map(Number);
  const date = new Date(y, m - 1, d + dias);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

export const diaDeLaSemana = (fecha: string): DiaSemana => {
  const [y, m, d] = fecha.split('-').map(Number);
  return DIAS_SEMANA[(new Date(y, m - 1, d).getDay() + 6) % 7];
};

// "2026-07-19" -> "sábado 19/07"
export const formatFechaCorta = (fecha: string): string => {
  const [y, m, d] = fecha.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: '2-digit' });
};

// "08:00:00" -> "08:00"
export const formatHora = (hora?: string): string => (hora ? hora.slice(0, 5) : '');

export const formatPrecio = (precio: number): string =>
  precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// Lunes de la semana que contiene 'fecha' (YYYY-MM-DD)
export const inicioSemana = (fecha: string): string => {
  const [y, m, d] = fecha.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const offset = (date.getDay() + 6) % 7; // 0 = lunes
  return sumarDias(fecha, -offset);
};

// Las 7 fechas (Lun→Dom) de la semana que arranca en 'lunes'
export const fechasSemana = (lunes: string): string[] =>
  Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));

// "2026-07-20" -> "20/07"
export const formatDiaMes = (fecha: string): string => {
  const [, m, d] = fecha.split('-');
  return `${d}/${m}`;
};
