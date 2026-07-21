import type { AxiosError } from 'axios';

export const extractErrorMessage = (err: unknown, fallback = 'Ocurrió un error inesperado'): string => {
  const axiosErr = err as AxiosError<{ message?: string }>;
  return axiosErr?.response?.data?.message ?? (err instanceof Error ? err.message : fallback);
};
