import api from './api';
import type { ApiResponse } from '../types/common.types';
import type { PlanDto, CreatePlanDto, UpdatePlanDto } from '../types/plan.types';

export const planService = {
  getAll: async (incluirInactivos = false): Promise<PlanDto[]> => {
    const response = await api.get<ApiResponse<PlanDto[]>>('/planes', {
      params: incluirInactivos ? { incluirInactivos: true } : undefined,
    });
    return response.data.data;
  },

  create: async (data: CreatePlanDto): Promise<PlanDto> => {
    const response = await api.post<ApiResponse<PlanDto>>('/planes', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdatePlanDto): Promise<PlanDto> => {
    const response = await api.patch<ApiResponse<PlanDto>>(`/planes/${id}`, data);
    return response.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/planes/${id}`);
  },
};
