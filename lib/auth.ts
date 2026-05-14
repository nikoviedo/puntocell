import { MOCK_USUARIOS } from './mocks';
import type { Usuario } from '@/types';

const USER_KEY = 'reparaciones_user';

export function login(email: string, password: string): Usuario | null {
  const usuario = MOCK_USUARIOS.find(
    (u) => u.email === email && u.password_hash === password
  );
  return usuario || null;
}

export function saveSession(usuario: Usuario) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  }
}

export function getCurrentUser(): Usuario | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}
