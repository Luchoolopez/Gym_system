import { DayOfWeek } from "../models/Schedule.model";

const DIAS: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

// Fecha local en formato YYYY-MM-DD
export const hoyStr = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Día de la semana (enum de la DB) para una fecha YYYY-MM-DD
export const diaDeLaSemana = (fecha: string): DayOfWeek => {
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year!, month! - 1, day!);
    return DIAS[date.getDay()]!;
};

// Combina fecha YYYY-MM-DD + hora HH:MM:SS en un Date local
export const combinarFechaHora = (fecha: string, hora: string): Date => {
    const [year, month, day] = fecha.split('-').map(Number);
    const [hours, minutes, seconds] = hora.split(':').map(Number);
    return new Date(year!, month! - 1, day!, hours ?? 0, minutes ?? 0, seconds ?? 0);
};

// Suma días a una fecha YYYY-MM-DD y devuelve YYYY-MM-DD
export const sumarDias = (fecha: string, dias: number): string => {
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year!, month! - 1, day! + dias);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};
