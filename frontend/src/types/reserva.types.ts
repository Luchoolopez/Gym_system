import type { DiaSemana } from './common.types';

export type EstadoReserva = 'RESERVED' | 'CANCELLED' | 'ATTENDED' | 'NO_SHOW';
export type EstadoClase = 'DISPONIBLE' | 'COMPLETA' | 'CERRADA' | 'EN_CURSO' | 'FINALIZADA';

export interface ClaseDelDiaDto {
  horarioId: number;
  fecha: string;
  actividad?: { id: number; nombre: string };
  profesor: { id: number; nombre: string; apellido: string } | null;
  sala?: string;
  horaInicio: string;
  horaFin: string;
  cupo: number | null;
  reservados: number;
  cuposDisponibles: number | null;
  estado: EstadoClase;
}

export interface ReservaDto {
  id: number;
  usuarioId: number;
  horarioId: number;
  actividad?: string;
  dia?: DiaSemana;
  horaInicio?: string;
  horaFin?: string;
  sala?: string;
  fecha: string;
  estado: EstadoReserva;
  fechaCreacion?: string;
}

export interface CreateReservaDto {
  horarioId: number;
  fecha: string;
}

export interface InscriptosDto {
  horarioId: number;
  actividad?: string;
  fecha: string;
  cupo: number | null;
  reservados: number;
  inscriptos: {
    reservaId: number;
    estado: EstadoReserva;
    usuario?: { id: number; nombre: string; apellido: string; dni?: string };
  }[];
}
