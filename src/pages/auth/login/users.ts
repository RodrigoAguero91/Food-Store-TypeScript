import { getUsers, setSessionUser } from '../../../utils/auth';
import { replaceRoute } from '../../../utils/navigate';
import { Rol } from '../../../types/Rol';

const formLogin = document.querySelector('#form-login') as HTMLFormElement | null;
const inputEmail = document.querySelector('#email') as HTMLInputElement | null;
const inputPassword = document.querySelector('#password') as HTMLInputElement | null;

if (formLogin) {
  formLogin.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    if (!inputEmail || !inputPassword) return;

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (u.password ?? '') === password
    );

    if (user) {
      setSessionUser(user);
      alert(`¡Bienvenido, ${user.nombre || user.email}!`);
      if (user.rol === Rol.ADMIN) {
        replaceRoute('src/pages/admin/index.html');
      } else {
        replaceRoute('src/pages/client/home/home.html');
      }
    } else {
      alert('Correo o contraseña incorrectos.');
    }
  });
}