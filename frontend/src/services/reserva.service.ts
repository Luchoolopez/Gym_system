import api from './api';
import type { ApiResponse } from '../types/common.types';
import type { ClaseDelDiaDto, ReservaDto, CreateReservaDto, InscriptosDto, EstadoReserva } from '../types/reserva.types';

export const reservaService = {
  getClasesDelDia: async (fecha?: string, actividadId?: number): Promise<ClaseDelDiaDto[]> => {
    const response = await api.get<ApiResponse<ClaseDelDiaDto[]>>('/reservas/dia', {
      params: { fecha, actividadId },
    });
    return response.data.data;
  },

  getMias: async (): Promise<ReservaDto[]> => {
    const response = await api.get<ApiResponse<ReservaDto[]>>('/reservas/mias');
    return response.data.data;
  },

  create: async (data: CreateReservaDto): Promise<ReservaDto> => {
    const response = await api.post<ApiResponse<ReservaDto>>('/reservas', data);
    return response.data.data;
  },

  cancelar: async (id: number): Promise<ReservaDto> => {
    const response = await api.patch<ApiResponse<ReservaDto>>(`/reservas/${id}/cancelar`);
    return response.data.data;
  },

  getInscriptos: async (horarioId: number, fecha: string): Promise<InscriptosDto> => {
    const response = await api.get<ApiResponse<InscriptosDto>>(`/reservas/clase/${horarioId}`, {
      params: { fecha },
    });
    return response.data.data;
  },

  marcarAsistencia: async (reservaId: number, estado: Extract<EstadoReserva, 'ATTENDED' | 'NO_SHOW'>): Promise<ReservaDto> => {
    const response = await api.patch<ApiResponse<ReservaDto>>(`/reservas/${reservaId}/asistencia`, { estado });
    return response.data.data;
  },
};
