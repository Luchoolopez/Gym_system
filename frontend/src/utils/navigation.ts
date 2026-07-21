import type { NavigateFunction } from 'react-router-dom';

let _navigate: NavigateFunction | null = null;

export const setNavigator = (navigate: NavigateFunction) => {
  _navigate = navigate;
};

export const navigateTo = (path: string) => {
  if (_navigate) {
    _navigate(path, { replace: true });
  } else {
    // Fallback solo si React Router aún no está montado
    window.location.href = path;
  }
};
