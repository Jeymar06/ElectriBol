import { NextResponse } from 'next/server';
import { signInAdmin } from '@/lib/auth';
import { consumeRateLimit, getClientIp, RateLimitError } from '@/lib/security';

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Debes enviar email y contrasena' }, { status: 400 });
  }

  try {
    const clientIp = getClientIp(request);
    consumeRateLimit('admin-login', `${clientIp}:${email.toLowerCase()}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    await signInAdmin(email, password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 429,
          headers: {
            'Retry-After': String(error.retryAfter),
          },
        }
      );
    }

    return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 });
  }
}
