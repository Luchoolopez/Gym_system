import axios from 'axios';
import { navigateTo } from '../utils/navigation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        const isLoginRequest = error.config?.url?.includes('/auth/login');

        if (!isLoginRequest) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth:unauthorized'));
          navigateTo('/login');
        }
      } else if (status === 403) {
        console.error('No tenés permisos para realizar esta acción.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
