export interface PlanDto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionDias: number;
  limiteClases: number | null;
  paseLibre: boolean;
  destacado: boolean;
  activo: boolean;
  fechaCreacion?: string;
}

export interface CreatePlanDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionDias: number;
  limiteClases?: number | null;
  destacado?: boolean;
  activo?: boolean;
}

export type UpdatePlanDto = Partial<CreatePlanDto>;
