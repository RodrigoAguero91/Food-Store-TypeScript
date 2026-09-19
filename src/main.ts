import { getSessionUser } from './utils/auth';
import { navigate } from './utils/navigate';
import { Rol } from './types/Rol';

const checkRouteProtection = (): void => {
  const currentPath = window.location.pathname;
  const user = getSessionUser();

 
  if (currentPath === '/' || currentPath === '') {
    if (user) {
      if (user.rol === Rol.ADMIN) {
        navigate('/src/pages/admin/'); 
      } else {
        navigate('/src/pages/client/');
      }
    } else {
      navigate('/src/pages/auth/login/');
    }
    return;
  }

  const isAdminRoute = currentPath.includes('/admin');
  const isClientRoute = currentPath.includes('/client');

  if ((isAdminRoute || isClientRoute) && !user) {
    alert('Debes iniciar sesión para acceder.');
    navigate('/src/pages/auth/login/');
    return;
  }

  if (isAdminRoute && user && user.rol !== Rol.ADMIN) {
    alert('Acceso denegado. No tienes permisos de administrador.');
    navigate('/src/pages/client/');
  }
};

checkRouteProtection();