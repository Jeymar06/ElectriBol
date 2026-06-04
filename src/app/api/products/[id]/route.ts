export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { consumeRateLimit, getClientIp, RateLimitError } from '@/lib/security';
import { deleteProduct, saveProduct, toggleProductField } from '@/lib/storage';
import type { ProductPayload } from '@/types';

export async function PUT(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    consumeRateLimit('admin-product-write', getClientIp(request), {
      limit: 40,
      windowMs: 10 * 60 * 1000,
    });

    const payload = (await request.json()) as ProductPayload;
    const product = await saveProduct(payload);
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible actualizar el producto' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    consumeRateLimit('admin-product-toggle', getClientIp(request), {
      limit: 80,
      windowMs: 10 * 60 * 1000,
    });

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
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible actualizar el producto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    consumeRateLimit('admin-product-delete', getClientIp(request), {
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });

    const id = new URL(request.url).pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Producto invalido' }, { status: 400 });
    }

    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible eliminar el producto' }, { status: 500 });
  }
}
