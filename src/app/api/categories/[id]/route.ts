export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { deleteCategory, saveCategory, toggleCategoryActive } from '@/lib/storage';
import type { CategoryPayload } from '@/types';

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const payload = (await request.json()) as CategoryPayload;
  const category = await saveCategory(payload);
  return NextResponse.json(category);
}

export async function PATCH(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { active } = (await request.json()) as { active: boolean };
  const id = new URL(request.url).pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Categoria invalida' }, { status: 400 });
  }

  const category = await toggleCategoryActive(id, active);
  return NextResponse.json(category);
}

export async function DELETE(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const id = new URL(request.url).pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Categoria invalida' }, { status: 400 });
  }

  try {
    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No fue posible eliminar la categoria';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
