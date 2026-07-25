import api from './api';
import type { ApiResponse, PagedResponse } from '../types/common.types';
import type { CierreDto, ResumenHoyDto } from '../types/cierre.types';

export const cierreService = {
  getResumenHoy: async (): Promise<ResumenHoyDto> => {
    const response = await api.get<ApiResponse<ResumenHoyDto>>('/cierres/hoy');
    return response.data.data;
  },

  getAll: async (page = 1, limit = 30): Promise<PagedResponse<CierreDto>> => {
    const response = await api.get<ApiResponse<PagedResponse<CierreDto>>>('/cierres', { params: { page, limit } });
    return response.data.data;
  },

  cerrarDia: async (notas?: string): Promise<CierreDto> => {
    const response = await api.post<ApiResponse<CierreDto>>('/cierres', { notas });
    return response.data.data;
  },
};
