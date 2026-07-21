export interface RutinaDto {
  id: number;
  titulo: string;
  contenido: string;
  profesor?: { id: number; nombre: string; apellido: string };
  usuario?: { id: number; nombre: string; apellido: string };
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CreateRutinaDto {
  usuarioId: number;
  titulo: string;
  contenido: string;
}

export interface UpdateRutinaDto {
  titulo?: string;
  contenido?: string;
}
