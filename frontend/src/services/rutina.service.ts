import api from './api';
import type { ApiResponse } from '../types/common.types';
import type { RutinaDto, CreateRutinaDto, UpdateRutinaDto } from '../types/rutina.types';

export const rutinaService = {
  getMias: async (): Promise<RutinaDto[]> => {
    const response = await api.get<ApiResponse<RutinaDto[]>>('/rutinas/mias');
    return response.data.data;
  },

  getCreadas: async (): Promise<RutinaDto[]> => {
    const response = await api.get<ApiResponse<RutinaDto[]>>('/rutinas/creadas');
    return response.data.data;
  },

  create: async (data: CreateRutinaDto): Promise<RutinaDto> => {
    const response = await api.post<ApiResponse<RutinaDto>>('/rutinas', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateRutinaDto): Promise<RutinaDto> => {
    const response = await api.patch<ApiResponse<RutinaDto>>(`/rutinas/${id}`, data);
    return response.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/rutinas/${id}`);
  },
};
