export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { consumeRateLimit, getClientIp, RateLimitError } from '@/lib/security';
import { getSiteContent, saveSiteContent } from '@/lib/site-content';
import type { SiteContent } from '@/types';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    consumeRateLimit('admin-site-content', getClientIp(request), {
      limit: 30,
      windowMs: 10 * 60 * 1000,
    });

    const payload = (await request.json()) as SiteContent;
    const content = await saveSiteContent(payload);
    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible guardar el contenido' }, { status: 500 });
  }
}
