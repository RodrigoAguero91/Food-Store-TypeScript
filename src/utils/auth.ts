import type { IUser } from '../types/IUser';

const USERS_KEY = 'users';
const SESSION_KEY = 'userData'; 

export const getUsers = (): IUser[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveUser = (user: IUser): void => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const setSessionUser = (user: IUser): void => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSessionUser = (): IUser | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
};

export const logout = (): void => {
    localStorage.removeItem(SESSION_KEY);
};