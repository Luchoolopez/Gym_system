import api from './api';
import type { ApiResponse, PagedResponse } from '../types/common.types';
import type { UsuarioAdminDto, CreateUsuarioDto, UpdateUsuarioDto, UpdatePerfilDto, UsuarioFilterDto } from '../types/usuario.types';

export const usuarioService = {
  getAll: async (params?: UsuarioFilterDto): Promise<PagedResponse<UsuarioAdminDto>> => {
    const response = await api.get<ApiResponse<PagedResponse<UsuarioAdminDto>>>('/usuarios', { params });
    return response.data.data;
  },

  getById: async (id: number): Promise<UsuarioAdminDto> => {
    const response = await api.get<ApiResponse<UsuarioAdminDto>>(`/usuarios/${id}`);
    return response.data.data;
  },

  create: async (data: CreateUsuarioDto): Promise<UsuarioAdminDto> => {
    const response = await api.post<ApiResponse<UsuarioAdminDto>>('/usuarios', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateUsuarioDto): Promise<UsuarioAdminDto> => {
    const response = await api.patch<ApiResponse<UsuarioAdminDto>>(`/usuarios/${id}`, data);
    return response.data.data;
  },

  updatePerfil: async (data: UpdatePerfilDto): Promise<UsuarioAdminDto> => {
    const response = await api.patch<ApiResponse<UsuarioAdminDto>>('/usuarios/perfil', data);
    return response.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};
