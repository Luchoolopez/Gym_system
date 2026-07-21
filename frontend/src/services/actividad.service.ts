import api from './api';
import type { ApiResponse } from '../types/common.types';
import type { ActividadDto, CreateActividadDto, UpdateActividadDto } from '../types/actividad.types';

export const actividadService = {
  getAll: async (incluirInactivas = false): Promise<ActividadDto[]> => {
    const response = await api.get<ApiResponse<ActividadDto[]>>('/actividades', {
      params: incluirInactivas ? { incluirInactivas: true } : undefined,
    });
    return response.data.data;
  },

  create: async (data: CreateActividadDto): Promise<ActividadDto> => {
    const response = await api.post<ApiResponse<ActividadDto>>('/actividades', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateActividadDto): Promise<ActividadDto> => {
    const response = await api.patch<ApiResponse<ActividadDto>>(`/actividades/${id}`, data);
    return response.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/actividades/${id}`);
  },
};
