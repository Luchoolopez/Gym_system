import api from './api';
import type { ApiResponse, PagedResponse } from '../types/common.types';
import type { CheckInDto, CreateCheckInDto } from '../types/checkin.types';

export const checkinService = {
  getAll: async (fecha?: string, page = 1, limit = 50): Promise<PagedResponse<CheckInDto>> => {
    const response = await api.get<ApiResponse<PagedResponse<CheckInDto>>>('/checkins', {
      params: { fecha, page, limit },
    });
    return response.data.data;
  },

  getMios: async (page = 1, limit = 50): Promise<PagedResponse<CheckInDto>> => {
    const response = await api.get<ApiResponse<PagedResponse<CheckInDto>>>('/checkins/mios', {
      params: { page, limit },
    });
    return response.data.data;
  },

  create: async (data: CreateCheckInDto): Promise<CheckInDto> => {
    const response = await api.post<ApiResponse<CheckInDto>>('/checkins', data);
    return response.data.data;
  },
};
