import { usuarioService } from '../../services/usuario.service';
import { useApiQuery } from '../useApiQuery';
import type { UsuarioFilterDto } from '../../types/usuario.types';

export const useAdminUsuarios = (filtros?: UsuarioFilterDto) => {
  const { data, loading, error, refetch } = useApiQuery(
    () => usuarioService.getAll(filtros),
    [filtros?.page, filtros?.limit, filtros?.rol, filtros?.busqueda]
  );
  return { usuarios: data?.items ?? [], totalItems: data?.totalItems ?? 0, loading, error, refetch };
};
