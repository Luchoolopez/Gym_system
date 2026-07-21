import api from './api';
import type { ApiResponse } from '../types/common.types';
import type { LoginDto, RegisterDto, AuthResponseDto, UsuarioDto } from '../types/auth.types';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post<ApiResponse<AuthResponseDto>>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post<ApiResponse<AuthResponseDto>>('/auth/register', data);
    return response.data.data;
  },

  me: async (): Promise<UsuarioDto> => {
    const response = await api.get<ApiResponse<UsuarioDto>>('/auth/me');
    return response.data.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string; token?: string }> => {
    const response = await api.post<ApiResponse<{ message: string; token?: string }>>('/auth/forgot-password', { email });
    return response.data.data;
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
