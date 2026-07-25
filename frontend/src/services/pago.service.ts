import api from './api';
import type { ApiResponse, PagedResponse } from '../types/common.types';
import type { PagoDto, CreatePagoDto, UpdatePagoDto, PagoFilterDto } from '../types/pago.types';

export const pagoService = {
  getAll: async (params?: PagoFilterDto): Promise<PagedResponse<PagoDto>> => {
    const response = await api.get<ApiResponse<PagedResponse<PagoDto>>>('/pagos', { params });
    return response.data.data;
  },

  getMios: async (): Promise<PagoDto[]> => {
    const response = await api.get<ApiResponse<PagoDto[]>>('/pagos/mios');
    return response.data.data;
  },

  create: async (data: CreatePagoDto): Promise<PagoDto> => {
    const response = await api.post<ApiResponse<PagoDto>>('/pagos', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdatePagoDto): Promise<PagoDto> => {
    const response = await api.patch<ApiResponse<PagoDto>>(`/pagos/${id}`, data);
    return response.data.data;
  },
};
