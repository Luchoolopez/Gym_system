import type { Rol, UsuarioDto } from './auth.types';

export interface UsuarioAdminDto extends UsuarioDto {
  fechaCreacion?: string;
}

export interface CreateUsuarioDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol?: Rol;
  dni?: string;
  telefono?: string;
  activo?: boolean;
}

export type UpdateUsuarioDto = Partial<CreateUsuarioDto>;

export interface UpdatePerfilDto {
  nombre?: string;
  apellido?: string;
  password?: string;
  dni?: string;
  telefono?: string;
}

export interface UsuarioFilterDto {
  page?: number;
  limit?: number;
  rol?: Rol;
  busqueda?: string;
}
