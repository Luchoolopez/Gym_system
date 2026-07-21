import { useState, useEffect, useCallback } from 'react';
import { extractErrorMessage } from '../utils/api.helpers';

// Hook genérico de lectura: los hooks de cada recurso lo componen
// (las páginas dependen de hooks, los hooks de services, los services de api)
export const useApiQuery = <T>(fetcher: () => Promise<T>, deps: unknown[] = [], enabled = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled]);

  return { data, loading, error, refetch: fetchData };
};
