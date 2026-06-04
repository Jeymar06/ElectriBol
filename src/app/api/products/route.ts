export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getProductsWithCategories } from '@/lib/catalog';
import { saveProduct } from '@/lib/storage';
import type { ProductPayload } from '@/types';

export async function GET() {
  const products = await getProductsWithCategories();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const payload = (await request.json()) as ProductPayload;
  const product = await saveProduct(payload);
  return NextResponse.json(product, { status: 201 });
}
