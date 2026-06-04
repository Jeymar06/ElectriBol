export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { deleteProduct, saveProduct, toggleProductField } from '@/lib/storage';
import type { ProductPayload } from '@/types';

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const payload = (await request.json()) as ProductPayload;
  const product = await saveProduct(payload);
  return NextResponse.json(product);
}

export async function PATCH(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { field, value, productId } = (await request.json()) as {
    field: 'available' | 'featured';
    value: boolean;
    productId?: string;
  };

  const url = new URL(request.url);
  const id = url.pathname.split('/').pop() || productId;
  if (!id) {
    return NextResponse.json({ error: 'Producto invalido' }, { status: 400 });
  }

  const product = await toggleProductField(id, field, value);
  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const id = new URL(request.url).pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Producto invalido' }, { status: 400 });
  }

  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
