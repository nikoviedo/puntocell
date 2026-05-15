'use client';

import { createClient } from '@/lib/supabase/client';
import type { Rol } from '@/types/database.types';

export type SessionUser = {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
};

export async function signIn(email: string, password: string): Promise<{ user: SessionUser | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { user: null, error: error?.message ?? 'No se pudo iniciar sesión' };
  }
  const profile = await fetchProfile(data.user.id);
  if (!profile) return { user: null, error: 'No se encontró el perfil del usuario' };
  return { user: profile, error: null };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return fetchProfile(user.id);
}

async function fetchProfile(id: string): Promise<SessionUser | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, nombre, rol')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}
