import { NextResponse } from 'next/server';
import { signInAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Debes enviar email y contrasena' }, { status: 400 });
  }

  try {
    await signInAdmin(email, password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No fue posible iniciar sesion';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
