export type EstadoPago = 'PENDING' | 'PAID' | 'CANCELLED';

export interface SuscripcionDto {
  id: number;
  usuarioId: number;
  usuario?: { id: number; nombre: string; apellido: string; dni?: string };
  plan?: { id: number; nombre: string; precio: number; limiteClases: number | null };
  fechaInicio: string;
  fechaFin: string;
  estadoPago: EstadoPago;
  clasesUsadas: number;
  clasesRestantes: number | null;
  vigente: boolean;
  fechaCreacion?: string;
}

export interface CreateSuscripcionDto {
  usuarioId: number;
  planId: number;
  fechaInicio?: string;
}

export interface RenovarSuscripcionDto {
  planId?: number;
  fechaInicio?: string;
}

export interface SuscripcionFilterDto {
  page?: number;
  limit?: number;
  estadoPago?: EstadoPago;
  vigentes?: boolean;
}
