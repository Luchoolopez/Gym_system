export interface ActividadDto {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion?: string;
}

export interface CreateActividadDto {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export type UpdateActividadDto = Partial<CreateActividadDto>;
