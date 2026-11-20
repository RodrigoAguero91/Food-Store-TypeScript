import { getSessionUser } from './auth';
import { Rol } from '../types/Rol';

export function resolveAppPath(relativeFromRoot: string): string {
  const clean = relativeFromRoot.replace(/^\.?\/?/, '');
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${clean}`;
}

export function navigate(relativeFromRoot: string): void {
  window.location.href = resolveAppPath(relativeFromRoot);
}

export function replaceRoute(relativeFromRoot: string): void {
  window.location.replace(resolveAppPath(relativeFromRoot));
}

export const protectRoute = (requireAdmin = false): boolean => {
  const user = getSessionUser();
  const currentPath = window.location.pathname;

  if (!user && (currentPath.includes('/client/') || currentPath.includes('/admin/'))) {
    alert('Debes iniciar sesión para acceder a esta sección.');
    replaceRoute('src/pages/auth/login/index.html');
    return false;
  }

  if (requireAdmin && user && user.rol !== Rol.ADMIN) {
    alert('Acceso denegado: No tenés permisos de administrador.');
    replaceRoute('src/pages/client/home/home.html');
    return false;
  }

  return true;
};