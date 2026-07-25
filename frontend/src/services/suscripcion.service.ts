import api from './api';
import type { ApiResponse, PagedResponse } from '../types/common.types';
import type { SuscripcionDto, CreateSuscripcionDto, RenovarSuscripcionDto, UpdateSuscripcionDto, SuscripcionFilterDto } from '../types/suscripcion.types';

export const suscripcionService = {
  getAll: async (params?: SuscripcionFilterDto): Promise<PagedResponse<SuscripcionDto>> => {
    const response = await api.get<ApiResponse<PagedResponse<SuscripcionDto>>>('/suscripciones', { params });
    return response.data.data;
  },

  getMia: async (): Promise<SuscripcionDto> => {
    const response = await api.get<ApiResponse<SuscripcionDto>>('/suscripciones/mia');
    return response.data.data;
  },

  getHistorialUsuario: async (userId: number): Promise<SuscripcionDto[]> => {
    const response = await api.get<ApiResponse<SuscripcionDto[]>>(`/suscripciones/usuario/${userId}`);
    return response.data.data;
  },

  create: async (data: CreateSuscripcionDto): Promise<SuscripcionDto> => {
    const response = await api.post<ApiResponse<SuscripcionDto>>('/suscripciones', data);
    return response.data.data;
  },

  renovar: async (id: number, data?: RenovarSuscripcionDto): Promise<SuscripcionDto> => {
    const response = await api.post<ApiResponse<SuscripcionDto>>(`/suscripciones/${id}/renovar`, data ?? {});
    return response.data.data;
  },

  update: async (id: number, data: UpdateSuscripcionDto): Promise<SuscripcionDto> => {
    const response = await api.patch<ApiResponse<SuscripcionDto>>(`/suscripciones/${id}`, data);
    return response.data.data;
  },

  cancelar: async (id: number): Promise<void> => {
    await api.patch(`/suscripciones/${id}/cancelar`);
  },
};
