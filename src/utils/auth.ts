import type { IUser } from '../types/IUser';
import { Rol } from '../types/Rol';
import { getSeedUsers } from '../data/seedExtra';

const USERS_KEY = 'foodstore_seed_users';
const SESSION_KEY = 'userData';

const FALLBACK_USERS: IUser[] = [
  {
    id: 'admin-1',
    nombre: 'Admin',
    apellido: 'FoodStore',
    email: 'admin@foodstore.com',
    password: 'admin',
    rol: Rol.ADMIN,
    eliminado: false,
  },
  {
    id: 'cliente-1',
    nombre: 'Cliente',
    apellido: 'Demo',
    email: 'cliente@foodstore.com',
    password: 'cliente',
    rol: Rol.CLIENT,
    eliminado: false,
  },
];

export const getUsers = (): IUser[] => {
  const seeded = getSeedUsers();
  if (seeded.length > 0) {
    return seeded;
  }

  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    localStorage.setItem(USERS_KEY, JSON.stringify(FALLBACK_USERS));
    return [...FALLBACK_USERS];
  }
  try {
    const parsed = JSON.parse(data) as IUser[];
    return parsed.filter((u) => !u.eliminado);
  } catch {
    return [...FALLBACK_USERS];
  }
};

export const saveUser = (user: IUser): void => {
  const allData = localStorage.getItem(USERS_KEY);
  let allUsers: IUser[] = [];
  if (allData) {
    try {
      allUsers = JSON.parse(allData) as IUser[];
    } catch {
      allUsers = [...getUsers()];
    }
  } else {
    allUsers = [...getUsers()];
  }
  allUsers.push({ ...user, eliminado: false });
  localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
};

export const setSessionUser = (user: IUser): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSessionUser = (): IUser | null => {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as IUser;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};