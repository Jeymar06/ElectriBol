import 'server-only';

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isProduction, isSupabaseEnabled } from '@/lib/env';
import type { Profile } from '@/types';

const SESSION_COOKIE = isProduction()
  ? '__Host-electribol_admin_session'
  : 'electribol_admin_session';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const sessionSecret = process.env.ADMIN_SESSION_SECRET;

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: isProduction(),
    path: '/',
    maxAge: 60 * 60 * 4,
  };
}

function isLocalAuthConfigured(): boolean {
  return Boolean(adminEmail && adminPassword && sessionSecret);
}

function isLocalAuthAllowed(): boolean {
  return !isProduction() && isLocalAuthConfigured();
}

function buildSessionToken(email: string): string {
  if (!sessionSecret) {
    throw new Error('La sesion local no esta configurada');
  }

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

export async function signInAdmin(email: string, password: string): Promise<void> {
  if (isSupabaseEnabled()) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      throw new Error('Credenciales invalidas');
    }

    const profile = await getSupabaseProfile(data.user.id);
    if (!profile || profile.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Credenciales invalidas');
    }

    return;
  }

  if (!isLocalAuthAllowed() || !adminEmail || !adminPassword) {
    throw new Error('El acceso local de administrador no esta disponible');
  }

  if (email !== adminEmail || password !== adminPassword) {
    throw new Error('Credenciales invalidas');
  }

  cookies().set(SESSION_COOKIE, buildSessionToken(email), getCookieOptions());
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
  if (!isLocalAuthAllowed() || !adminEmail || token !== buildSessionToken(adminEmail)) {
    return null;
  }

  return {
    id: 'local-admin',
    email: adminEmail,
    role: 'admin',
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await getAdminProfile());
}
