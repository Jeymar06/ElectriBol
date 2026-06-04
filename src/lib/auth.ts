import 'server-only';

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseEnabled } from '@/lib/env';
import type { Profile } from '@/types';

const SESSION_COOKIE = 'electribol_admin_session';
const defaultEmail = process.env.ADMIN_EMAIL || 'admin@electribol.com';
const defaultPassword = process.env.ADMIN_PASSWORD || 'ElectriBol2026!';
const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'electribol-local-secret';

function buildSessionToken(email: string): string {
  return crypto.createHmac('sha256', sessionSecret).update(email).digest('hex');
}

async function getSupabaseProfile(userId: string): Promise<Profile | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    fullName: data.full_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export function getAdminCredentials() {
  return {
    email: defaultEmail,
    password: defaultPassword,
  };
}

export async function createAdminSession(email: string): Promise<void> {
  if (isSupabaseEnabled()) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: process.env.SUPABASE_ADMIN_PASSWORD || defaultPassword,
    });

    if (error) {
      throw error;
    }

    return;
  }

  cookies().set(SESSION_COOKIE, buildSessionToken(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  if (isSupabaseEnabled()) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.user) {
        throw error || new Error('No fue posible iniciar sesion');
      }

      const profile = await getSupabaseProfile(data.user.id);
      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Tu usuario no tiene permisos de administrador');
      }

      return;
    } catch (error) {
      // Mientras se termina de montar el esquema en Supabase, permitimos
      // seguir usando el fallback local con las mismas credenciales.
      if (email === defaultEmail && password === defaultPassword) {
        cookies().set(SESSION_COOKIE, buildSessionToken(email), {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          path: '/',
          maxAge: 60 * 60 * 12,
        });
        return;
      }

      throw error;
    }
  }

  if (email !== defaultEmail || password !== defaultPassword) {
    throw new Error('Credenciales invalidas');
  }

  cookies().set(SESSION_COOKIE, buildSessionToken(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export async function destroyAdminSession(): Promise<void> {
  if (isSupabaseEnabled()) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
    return;
  }

  cookies().delete(SESSION_COOKIE);
}

export async function getAdminProfile(): Promise<Profile | null> {
  if (isSupabaseEnabled()) {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const profile = await getSupabaseProfile(user.id);
    if (!profile || profile.role !== 'admin') {
      return null;
    }

    return profile;
  }

  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token !== buildSessionToken(defaultEmail)) {
    return null;
  }

  return {
    id: 'local-admin',
    email: defaultEmail,
    role: 'admin',
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await getAdminProfile());
}
