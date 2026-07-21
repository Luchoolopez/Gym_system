export const isTokenExpired = (token: string | null | undefined): boolean => {
  if (!token) return true;

  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;

    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const decodedPayload = JSON.parse(atob(payload));
    const exp = decodedPayload?.exp;

    if (typeof exp !== 'number') return false;

    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const hasValidAuthToken = (token: string | null | undefined): boolean => !isTokenExpired(token);
