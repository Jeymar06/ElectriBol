export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getCategories } from '@/lib/catalog';
import { consumeRateLimit, getClientIp, RateLimitError } from '@/lib/security';
import { saveCategory } from '@/lib/storage';
import type { CategoryPayload } from '@/types';

export async function GET() {
  const categories = await getCategories(false);
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    consumeRateLimit('admin-category-write', getClientIp(request), {
      limit: 30,
      windowMs: 10 * 60 * 1000,
    });

    const payload = (await request.json()) as CategoryPayload;
    const category = await saveCategory(payload);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible guardar la categoria' }, { status: 500 });
  }
}
