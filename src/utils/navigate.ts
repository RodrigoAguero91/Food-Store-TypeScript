import { getSessionUser } from './auth';

export const protectRoute = () => {
    const user = getSessionUser();
    const currentPath = window.location.pathname;

    
    if (!user && (currentPath.includes('/client/') || currentPath.includes('/admin/'))) {
        alert('Debes iniciar sesión para acceder a esta sección.');
        window.location.href = '../auth/login/index.html';
        return;
    }

    
    if (user && user.rol !== 'admin' && currentPath.includes('/admin/')) {
        alert('Acceso denegado. No tenés permisos de administrador.');
        window.location.href = '../client/index.html';
    }
};