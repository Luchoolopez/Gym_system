import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { extractErrorMessage } from '../utils/api.helpers';
import { hasValidAuthToken } from '../utils/auth';
import type { LoginDto, RegisterDto, UsuarioDto } from '../types/auth.types';

export const useAuth = () => {
  const [user, setUser] = useState<UsuarioDto | null>(() => {
    const token = localStorage.getItem('token');
    if (!hasValidAuthToken(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    try {
      const userStr = localStorage.getItem('user');
      return userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (data: LoginDto) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authService.login(data);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.usuario));
      setUser(res.usuario);
      return res;
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Error al iniciar sesión'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authService.register(data);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.usuario));
      setUser(res.usuario);
      return res;
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Error al registrarse'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const usuario = await authService.me();
    localStorage.setItem('user', JSON.stringify(usuario));
    setUser(usuario);
  };

  return { user, login, register, logout, refreshUser, loading, error };
};
