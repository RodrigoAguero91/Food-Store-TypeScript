import { getUsers, saveUser } from '../../../utils/auth';
import { replaceRoute } from '../../../utils/navigate';
import type { IUser } from '../../../types/IUser';
import { Rol } from '../../../types/Rol';

const formRegistro = document.querySelector('#form-registro') as HTMLFormElement | null;
const inputNombre = document.querySelector('#nombre') as HTMLInputElement | null;
const inputEmail = document.querySelector('#email') as HTMLInputElement | null;
const inputPassword = document.querySelector('#password') as HTMLInputElement | null;

if (formRegistro) {
  formRegistro.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    if (!inputEmail || !inputPassword) return;

    const nombre = inputNombre ? inputNombre.value.trim() : '';
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const users = getUsers();
    const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (userExists) {
      alert('El correo electrónico ya está registrado.');
      return;
    }

    const newUser: IUser = {
      id: Date.now().toString(),
      nombre: nombre || email.split('@')[0],
      email,
      password,
      rol: Rol.CLIENT,
      eliminado: false,
    };

    saveUser(newUser);
    alert('¡Usuario registrado con éxito! Ahora podés iniciar sesión.');
    replaceRoute('src/pages/auth/login/index.html');
  });
}