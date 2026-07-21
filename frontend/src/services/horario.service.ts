import api from './api';
import type { ApiResponse } from '../types/common.types';
import type { HorarioDto, CreateHorarioDto, UpdateHorarioDto, HorarioFilterDto } from '../types/horario.types';

export const horarioService = {
  getGrilla: async (params?: HorarioFilterDto): Promise<HorarioDto[]> => {
    const response = await api.get<ApiResponse<HorarioDto[]>>('/horarios', { params });
    return response.data.data;
  },

  getByProfesor: async (profesorId: number): Promise<HorarioDto[]> => {
    const response = await api.get<ApiResponse<HorarioDto[]>>(`/horarios/profesor/${profesorId}`);
    return response.data.data;
  },

  create: async (data: CreateHorarioDto): Promise<HorarioDto> => {
    const response = await api.post<ApiResponse<HorarioDto>>('/horarios', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateHorarioDto): Promise<HorarioDto> => {
    const response = await api.patch<ApiResponse<HorarioDto>>(`/horarios/${id}`, data);
    return response.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/horarios/${id}`);
  },
};
