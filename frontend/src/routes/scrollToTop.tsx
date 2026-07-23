import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setNavigator } from '../utils/navigation';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Registramos el navigator para que los interceptores de axios puedan redirigir
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
