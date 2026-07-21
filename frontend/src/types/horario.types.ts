import type { DiaSemana } from './common.types';

export interface HorarioDto {
  id: number;
  actividad?: { id: number; nombre: string };
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
  profesor: { id: number; nombre: string; apellido: string } | null;
  sala?: string;
  cupo: number | null;
  activo: boolean;
}

export interface CreateHorarioDto {
  actividadId: number;
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
  profesorId?: number | null;
  sala?: string;
  cupo?: number | null;
  activo?: boolean;
}

export type UpdateHorarioDto = Partial<CreateHorarioDto>;

export interface HorarioFilterDto {
  actividadId?: number;
  dia?: DiaSemana;
}
