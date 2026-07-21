export interface CheckInDto {
  id: number;
  usuario?: { id: number; nombre: string; apellido: string; dni?: string };
  fechaHora: string;
  registradoPor?: { id: number; nombre: string; apellido: string } | null;
  notas?: string;
  reservaAsistida?: number | null;
  clasesRestantes?: number | null;
}

export interface CreateCheckInDto {
  dni?: string;
  usuarioId?: number;
  notas?: string;
}
