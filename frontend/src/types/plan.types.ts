export interface PlanDto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionDias: number;
  limiteClases: number | null;
  paseLibre: boolean;
  activo: boolean;
  fechaCreacion?: string;
}

export interface CreatePlanDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionDias: number;
  limiteClases?: number | null;
  activo?: boolean;
}

export type UpdatePlanDto = Partial<CreatePlanDto>;
