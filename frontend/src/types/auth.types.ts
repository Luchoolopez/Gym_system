export type Rol = 'Admin' | 'Profesor' | 'User';

export interface UsuarioDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni?: string;
  telefono?: string;
  rol: Rol;
  activo: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  dni?: string;
  telefono?: string;
}

export interface AuthResponseDto {
  usuario: UsuarioDto;
  accessToken: string;
}
