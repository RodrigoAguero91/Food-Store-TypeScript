import { getUsers, saveUser } from '../../../utils/auth';
import type { IUser } from '../../../types/IUser'; 

const formRegistro = document.querySelector('#form-registro') as HTMLFormElement | null;
const inputEmail = document.querySelector('#email') as HTMLInputElement | null;
const inputPassword = document.querySelector('#password') as HTMLInputElement | null;

if (formRegistro) {
    formRegistro.addEventListener('submit', (e: Event) => {
        e.preventDefault();

        if (!inputEmail || !inputPassword) return;

        const email = inputEmail.value.trim();
        const password = inputPassword.value.trim();

        if (!email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const users = getUsers();
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            alert('El correo electrónico ya está registrado.');
            return;
        }

        
        const newUser: IUser = {
            id: Date.now().toString(),
            email,
            password,
            rol: 'cliente' as IUser['rol']
        };

        saveUser(newUser);
        alert('¡Usuario registrado con éxito! Ahora podés iniciar sesión.');
        
        
        window.location.href = '../login/index.html';
    });
}