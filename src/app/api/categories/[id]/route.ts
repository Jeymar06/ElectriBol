export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { consumeRateLimit, getClientIp, RateLimitError } from '@/lib/security';
import { deleteCategory, saveCategory, toggleCategoryActive } from '@/lib/storage';
import type { CategoryPayload } from '@/types';

export async function PUT(request: Request) {
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
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible actualizar la categoria' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    consumeRateLimit('admin-category-toggle', getClientIp(request), {
      limit: 60,
      windowMs: 10 * 60 * 1000,
    });

    const { active } = (await request.json()) as { active: boolean };
    const id = new URL(request.url).pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Categoria invalida' }, { status: 400 });
    }

    const category = await toggleCategoryActive(id, active);
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible actualizar la categoria' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    consumeRateLimit('admin-category-delete', getClientIp(request), {
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });

    const id = new URL(request.url).pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Categoria invalida' }, { status: 400 });
    }

    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    const message = error instanceof Error ? error.message : 'No fue posible eliminar la categoria';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
