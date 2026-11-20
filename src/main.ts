import { getSessionUser } from './utils/auth';
import { replaceRoute } from './utils/navigate';
import { Rol } from './types/Rol';

const checkRouteProtection = (): void => {
  const currentPath = window.location.pathname;
  const user = getSessionUser();

  if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
    if (user) {
      if (user.rol === Rol.ADMIN) {
        replaceRoute('src/pages/admin/index.html');
      } else {
        replaceRoute('src/pages/client/home/home.html');
      }
    } else {
      replaceRoute('src/pages/auth/login/index.html');
    }
    return;
  }

  const isAdminRoute = currentPath.includes('/admin');
  const isClientRoute = currentPath.includes('/client');

  if ((isAdminRoute || isClientRoute) && !user) {
    alert('Debes iniciar sesión para acceder.');
    replaceRoute('src/pages/auth/login/index.html');
    return;
  }

  if (isAdminRoute && user && user.rol !== Rol.ADMIN) {
    alert('Acceso denegado. No tienes permisos de administrador.');
    replaceRoute('src/pages/client/home/home.html');
  }
};

checkRouteProtection();