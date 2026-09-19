import { getSessionUser, logout } from '../../utils/auth';


const user = getSessionUser();

if (!user) {
    alert('Debes iniciar sesión para acceder al panel de administración.');
    window.location.replace('/src/pages/auth/login/index.html');
} else if (user.rol !== 'admin') {
    alert('Acceso denegado: No tenés permisos de administrador.');
    window.location.replace('/src/pages/client/index.html'); 
}


const spanUserInfo = document.querySelector('#user-info');
if (spanUserInfo && user) {
    spanUserInfo.textContent = `Admin: ${user.email}`;
}


const btnLogout = document.querySelector('#btn-logout') as HTMLButtonElement | null;
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        logout();
        window.location.replace('/src/pages/auth/login/index.html');
    });
}