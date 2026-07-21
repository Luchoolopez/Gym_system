import api from './api';
import type { ApiResponse } from '../types/common.types';
import type { MisEstadisticasDto, DashboardDto } from '../types/stats.types';

export const statsService = {
  getMias: async (): Promise<MisEstadisticasDto> => {
    const response = await api.get<ApiResponse<MisEstadisticasDto>>('/estadisticas/mias');
    return response.data.data;
  },

  getDashboard: async (): Promise<DashboardDto> => {
    const response = await api.get<ApiResponse<DashboardDto>>('/estadisticas/dashboard');
    return response.data.data;
  },
};
