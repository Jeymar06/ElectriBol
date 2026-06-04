export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getProductsWithCategories } from '@/lib/catalog';
import { consumeRateLimit, getClientIp, RateLimitError } from '@/lib/security';
import { saveProduct } from '@/lib/storage';
import type { ProductPayload } from '@/types';

export async function GET() {
  const products = await getProductsWithCategories();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
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
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible guardar el producto' }, { status: 500 });
  }
}
