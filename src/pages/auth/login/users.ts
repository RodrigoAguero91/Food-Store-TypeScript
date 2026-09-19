import { getUsers, setSessionUser } from '../../../utils/auth';

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
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            
            setSessionUser(user);
            alert(`¡Bienvenido, ${user.email}!`);
            
            
            window.location.href = '/src/pages/client/home/home.html';
        } else {
            alert('Correo o contraseña incorrectos.');
        }
    });
}