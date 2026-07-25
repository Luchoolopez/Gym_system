export interface CierreDto {
  id: number;
  fecha: string;
  totalCheckins: number;
  totalIngresos: number;
  notas?: string;
  cerradoPor?: { id: number; nombre: string; apellido: string } | null;
  fechaCierre?: string;
}

export interface ResumenHoyDto {
  fecha: string;
  totalCheckins: number;
  totalIngresos: number;
  cerrado: boolean;
}
